import { AgreementType, AgreementStatus } from "@prisma/client";
export declare class CreateAgreementDto {
    caseId: string;
    institutionId: string;
    type: AgreementType;
    amount: number;
    discountPercentage?: number;
    installments?: number;
    status?: AgreementStatus;
}
