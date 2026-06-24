import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { UpsertPortfolioRuleDto } from "./dto/upsert-portfolio-rule.dto";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";
import {
  EffectiveRules,
  InstitutionRules,
  PortfolioRules,
  mergeRules,
} from "./rule-evaluation";

/** Coerce a Prisma Decimal/number/null to a plain number|null. */
function num(value: unknown): number | null {
  if (value == null) return null;
  return Number(value);
}

@Injectable()
export class PortfolioRulesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Load and merge the institution-wide and portfolio-level rules for a case's
   * institution + portfolio. Always returns an `EffectiveRules` object (fields
   * are `null` when not configured / not enforced).
   */
  async getEffectiveRules(
    institutionId: string,
    portfolioId: string,
  ): Promise<EffectiveRules> {
    const [institution, portfolioRule] = await Promise.all([
      this.prisma.institution.findUnique({
        where: { id: institutionId },
        select: {
          maxDiscountAuto: true,
          maxDiscountManual: true,
          minInstallments: true,
          maxInstallments: true,
          autoApprovalLimit: true,
        },
      }),
      this.prisma.portfolioRule.findUnique({
        where: { portfolioId },
      }),
    ]);

    const institutionRules: InstitutionRules | null = institution
      ? {
          maxDiscountAuto: num(institution.maxDiscountAuto),
          maxDiscountManual: num(institution.maxDiscountManual),
          minInstallments: num(institution.minInstallments),
          maxInstallments: num(institution.maxInstallments),
          autoApprovalLimit: num(institution.autoApprovalLimit),
        }
      : null;

    const portfolioRules: PortfolioRules | null = portfolioRule
      ? {
          discountMax: num(portfolioRule.discountMax),
          minInstallments: num(portfolioRule.minInstallments),
          maxInstallments: num(portfolioRule.maxInstallments),
          autoApprovalLimit: num(portfolioRule.autoApprovalLimit),
          channelsAllowed: portfolioRule.channelsAllowed ?? null,
        }
      : null;

    return mergeRules(institutionRules, portfolioRules);
  }

  /** Read the raw portfolio rule (tenant-scoped). */
  async getForPortfolio(portfolioId: string, user: AuthenticatedUser) {
    await this.assertPortfolioInTenant(portfolioId, user);
    return this.prisma.portfolioRule.findUnique({
      where: { portfolioId },
    });
  }

  /** Create or update the portfolio rule (tenant-scoped). */
  async upsertForPortfolio(
    portfolioId: string,
    data: UpsertPortfolioRuleDto,
    user: AuthenticatedUser,
  ) {
    await this.assertPortfolioInTenant(portfolioId, user);

    // Only carry through fields that were actually provided (optional DTO).
    const payload: Record<string, unknown> = {};
    if (data.discountMax !== undefined) payload.discountMax = data.discountMax;
    if (data.minInstallments !== undefined)
      payload.minInstallments = data.minInstallments;
    if (data.maxInstallments !== undefined)
      payload.maxInstallments = data.maxInstallments;
    if (data.autoApprovalLimit !== undefined)
      payload.autoApprovalLimit = data.autoApprovalLimit;
    if (data.channelsAllowed !== undefined)
      payload.channelsAllowed = data.channelsAllowed;

    return this.prisma.portfolioRule.upsert({
      where: { portfolioId },
      create: { portfolioId, ...payload },
      update: payload,
    });
  }

  /** Ensure the portfolio exists and belongs to the user's tenant. */
  private async assertPortfolioInTenant(
    portfolioId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      select: { id: true, institutionId: true, deletedAt: true },
    });

    if (!portfolio || portfolio.deletedAt) {
      throw new NotFoundException("Portfolio not found");
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      portfolio.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Portfolio does not belong to your institution",
      );
    }
  }
}
