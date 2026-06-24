import { PrismaService } from "../common/prisma.service";
import { UpsertPortfolioRuleDto } from "./dto/upsert-portfolio-rule.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import { EffectiveRules } from "./rule-evaluation";
export declare class PortfolioRulesService {
    private prisma;
    constructor(prisma: PrismaService);
    getEffectiveRules(institutionId: string, portfolioId: string): Promise<EffectiveRules>;
    getForPortfolio(portfolioId: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minInstallments: number | null;
        maxInstallments: number | null;
        autoApprovalLimit: import("@prisma/client/runtime/library").Decimal | null;
        portfolioId: string;
        discountMax: import("@prisma/client/runtime/library").Decimal | null;
        channelsAllowed: string[];
    }>;
    upsertForPortfolio(portfolioId: string, data: UpsertPortfolioRuleDto, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minInstallments: number | null;
        maxInstallments: number | null;
        autoApprovalLimit: import("@prisma/client/runtime/library").Decimal | null;
        portfolioId: string;
        discountMax: import("@prisma/client/runtime/library").Decimal | null;
        channelsAllowed: string[];
    }>;
    private assertPortfolioInTenant;
}
