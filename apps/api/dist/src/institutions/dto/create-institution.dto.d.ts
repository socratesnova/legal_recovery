import { InstitutionType, EntityStatus } from "@prisma/client";
export declare class CreateInstitutionDto {
    name: string;
    type: InstitutionType;
    taxId?: string;
    country?: string;
    status?: EntityStatus;
    maxDiscountAuto?: number;
    maxDiscountManual?: number;
    minInstallments?: number;
    maxInstallments?: number;
    autoApprovalLimit?: number;
}
