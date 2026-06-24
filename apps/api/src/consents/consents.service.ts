import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { GrantConsentDto } from "./dto/grant-consent.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

/**
 * Consents are modeled as an immutable event log: each grant or revocation is a
 * new row. The latest row for a (debtor, type) defines the current state.
 * `LegalFirewallService.findConsent` reads the latest granted+non-revoked row.
 */
@Injectable()
export class ConsentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(debtorId: string | undefined, user: AuthenticatedUser) {
    if (debtorId) {
      await this.assertDebtorInTenant(debtorId, user);
      return this.prisma.consent.findMany({
        where: { debtorId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return this.prisma.consent.findMany({ orderBy: { createdAt: "desc" } });
    }

    // Non-super-admins only see consents for debtors in their institution.
    const debtorIds = await this.getTenantDebtorIds(user);
    return this.prisma.consent.findMany({
      where: { debtorId: { in: debtorIds } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByDebtor(debtorId: string, user: AuthenticatedUser) {
    await this.assertDebtorInTenant(debtorId, user);
    return this.prisma.consent.findMany({
      where: { debtorId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const consent = await this.prisma.consent.findUnique({ where: { id } });
    if (!consent) {
      throw new NotFoundException("Consent not found");
    }
    await this.assertDebtorInTenant(consent.debtorId, user);
    return consent;
  }

  async grant(dto: GrantConsentDto, user: AuthenticatedUser) {
    await this.assertDebtorInTenant(dto.debtorId, user);

    return this.prisma.consent.create({
      data: {
        debtorId: dto.debtorId,
        type: dto.type,
        granted: true,
        grantedAt: new Date(),
        revokedAt: null,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });
  }

  /**
   * Revoke the latest active consent of a given type for a debtor by appending
   * a revocation row (granted=false). Preserves the full history.
   */
  async revoke(id: string, user: AuthenticatedUser) {
    const consent = await this.findById(id, user);

    return this.prisma.consent.create({
      data: {
        debtorId: consent.debtorId,
        type: consent.type,
        granted: false,
        grantedAt: null,
        revokedAt: new Date(),
        ipAddress: undefined,
        userAgent: undefined,
      },
    });
  }

  /**
   * Convenience: revoke by (debtorId, type) without needing the consent id.
   */
  async revokeByType(
    debtorId: string,
    type: import("@prisma/client").ConsentType,
    user: AuthenticatedUser,
  ) {
    await this.assertDebtorInTenant(debtorId, user);
    return this.prisma.consent.create({
      data: {
        debtorId,
        type,
        granted: false,
        grantedAt: null,
        revokedAt: new Date(),
      },
    });
  }

  private async getTenantDebtorIds(user: AuthenticatedUser): Promise<string[]> {
    if (!user.institutionId) {
      throw new ForbiddenException("User is not assigned to any institution");
    }
    const cases = await this.prisma.case.findMany({
      where: { institutionId: user.institutionId, deletedAt: null },
      select: { debtorId: true },
      distinct: ["debtorId"],
    });
    return cases.map((c) => c.debtorId);
  }

  private async assertDebtorInTenant(
    debtorId: string,
    user: AuthenticatedUser,
  ) {
    if (user.role === UserRole.SUPER_ADMIN) return;

    if (!user.institutionId) {
      throw new ForbiddenException("User is not assigned to any institution");
    }

    const tenantCase = await this.prisma.case.findFirst({
      where: { debtorId, institutionId: user.institutionId, deletedAt: null },
      select: { id: true },
    });

    if (!tenantCase) {
      throw new ForbiddenException(
        "Debtor does not belong to your institution",
      );
    }
  }
}
