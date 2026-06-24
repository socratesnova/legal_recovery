import { CaseStatus } from "@prisma/client";
declare class CreateDebtorDto {
    firstName: string;
    lastName: string;
    idNumber: string;
    idType?: string;
}
declare class CreateCaseProductDto {
    productType: string;
    originalAmount: number;
    currentBalance: number;
    interestRate?: number;
}
export declare class CreateCaseDto {
    caseNumber: string;
    institutionId: string;
    portfolioId: string;
    debtorId?: string;
    debtor?: CreateDebtorDto;
    totalBalance: number;
    status?: CaseStatus;
    scoreDocumental?: number;
    scoreRecoverability?: number;
    scoreContactability?: number;
    scoreRisk?: number;
    nextAction?: string;
    nextActionDate?: string;
    products?: CreateCaseProductDto[];
}
export {};
