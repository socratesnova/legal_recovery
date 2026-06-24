import { CaseStatus } from "@prisma/client";
export declare class CaseFilterDto {
    institutionId?: string;
    portfolioId?: string;
    status?: CaseStatus;
    search?: string;
    debtorId?: string;
}
