import { ReportsService } from "./reports.service";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getKpis(user: AuthenticatedUser): Promise<{
        totalCases: number;
        casesByStatus: Record<string, number>;
        totalPortfolios: number;
        totalDebtors: number;
        totalAgreements: number;
        totalPaymentsAmount: number | import("@prisma/client/runtime/library").Decimal;
        upcomingActions: {
            id: string;
            caseNumber: string;
            debtorName: string;
            nextAction: string;
            nextActionDate: Date;
        }[];
    }>;
}
