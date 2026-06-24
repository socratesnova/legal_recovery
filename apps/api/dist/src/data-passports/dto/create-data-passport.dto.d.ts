import { PassportStatus } from "@prisma/client";
export declare class CreateDataPassportDto {
    caseId: string;
    entityType: string;
    entityId: string;
    fieldName: string;
    fieldValueHash?: string;
    sourceType: string;
    sourceReference?: string;
    legalBasis: string;
    allowedUses: string[];
    prohibitedUses: string[];
    confidenceScore?: number;
    visibilityRoles: string[];
    status?: PassportStatus;
    expirationDate?: string;
}
export declare class UpdateDataPassportDto {
    fieldValueHash?: string;
    sourceReference?: string;
    legalBasis?: string;
    allowedUses?: string[];
    prohibitedUses?: string[];
    confidenceScore?: number;
    visibilityRoles?: string[];
    status?: PassportStatus;
    expirationDate?: string;
    lastValidatedAt?: string;
}
