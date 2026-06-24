import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import {
  CreateDataPassportDto,
  UpdateDataPassportDto,
} from "./dto/create-data-passport.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";
import { PassportStatus } from "@prisma/client";

@Injectable()
export class DataPassportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(caseId: string | undefined, user: AuthenticatedUser) {
    // Data passports are scoped through the case's institution.
    const where: {
      caseId?: string;
      case?: { institutionId?: string };
    } = {};

    if (caseId) {
      where.caseId = caseId;
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.case = { institutionId: user.institutionId };
    }

    return this.prisma.dataPassport.findMany({
      where,
      orderBy: { capturedAt: "desc" },
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  async findById(id: string, user: AuthenticatedUser) {
    const passport = await this.prisma.dataPassport.findUnique({
      where: { id },
      include: {
        case: { select: { id: true, caseNumber: true, institutionId: true } },
      },
    });

    if (!passport) {
      throw new NotFoundException("Data Passport not found");
    }

    this.assertTenant(passport.case.institutionId, user);
    return passport;
  }

  async create(data: CreateDataPassportDto, user: AuthenticatedUser) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: data.caseId },
      select: { id: true, institutionId: true },
    });

    if (!caseRecord) {
      throw new NotFoundException("Case not found");
    }

    this.assertTenant(caseRecord.institutionId, user);

    return this.prisma.dataPassport.create({
      data: {
        caseId: data.caseId,
        entityType: data.entityType,
        entityId: data.entityId,
        fieldName: data.fieldName,
        fieldValueHash: data.fieldValueHash,
        sourceType: data.sourceType,
        sourceReference: data.sourceReference,
        legalBasis: data.legalBasis,
        allowedUses: data.allowedUses,
        prohibitedUses: data.prohibitedUses,
        confidenceScore: data.confidenceScore,
        visibilityRoles: data.visibilityRoles,
        status: data.status ?? PassportStatus.ACTIVE,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : undefined,
        lastValidatedAt: new Date(),
      },
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  async update(
    id: string,
    data: UpdateDataPassportDto,
    user: AuthenticatedUser,
  ) {
    await this.findById(id, user); // ensure exists and belongs to tenant

    const updateData: {
      fieldValueHash?: string;
      sourceReference?: string;
      legalBasis?: string;
      allowedUses?: string[];
      prohibitedUses?: string[];
      confidenceScore?: number;
      visibilityRoles?: string[];
      status?: PassportStatus;
      expirationDate?: Date;
      lastValidatedAt?: Date;
    } = {
      fieldValueHash: data.fieldValueHash,
      sourceReference: data.sourceReference,
      legalBasis: data.legalBasis,
      allowedUses: data.allowedUses,
      prohibitedUses: data.prohibitedUses,
      confidenceScore: data.confidenceScore,
      visibilityRoles: data.visibilityRoles,
      status: data.status,
      expirationDate: data.expirationDate
        ? new Date(data.expirationDate)
        : undefined,
      lastValidatedAt: data.lastValidatedAt
        ? new Date(data.lastValidatedAt)
        : undefined,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return this.prisma.dataPassport.update({
      where: { id },
      data: updateData,
      include: { case: { select: { id: true, caseNumber: true } } },
    });
  }

  /**
   * Revoke (block) a passport instead of deleting it, preserving the audit trail
   * and provenance history. Physical deletion is reserved for SUPER_ADMIN only.
   */
  async revoke(id: string, user: AuthenticatedUser) {
    await this.findById(id, user);
    return this.prisma.dataPassport.update({
      where: { id },
      data: { status: PassportStatus.BLOCKED },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    await this.findById(id, user);
    return this.prisma.dataPassport.delete({ where: { id } });
  }

  private assertTenant(institutionId: string, user: AuthenticatedUser) {
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Data Passport does not belong to your institution",
      );
    }
  }
}
