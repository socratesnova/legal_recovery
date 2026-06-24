import { PrismaService } from "../common/prisma.service";
import { CreateDataPassportDto, UpdateDataPassportDto } from "./dto/create-data-passport.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class DataPassportsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(caseId: string | undefined, user: AuthenticatedUser): Promise<({
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.PassportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        entityType: string;
        entityId: string;
        fieldName: string;
        fieldValueHash: string | null;
        sourceType: string;
        sourceReference: string | null;
        legalBasis: string;
        allowedUses: string[];
        prohibitedUses: string[];
        confidenceScore: number | null;
        visibilityRoles: string[];
        capturedAt: Date;
        lastValidatedAt: Date | null;
        expirationDate: Date | null;
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.PassportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        entityType: string;
        entityId: string;
        fieldName: string;
        fieldValueHash: string | null;
        sourceType: string;
        sourceReference: string | null;
        legalBasis: string;
        allowedUses: string[];
        prohibitedUses: string[];
        confidenceScore: number | null;
        visibilityRoles: string[];
        capturedAt: Date;
        lastValidatedAt: Date | null;
        expirationDate: Date | null;
    }>;
    create(data: CreateDataPassportDto, user: AuthenticatedUser): Promise<{
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.PassportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        entityType: string;
        entityId: string;
        fieldName: string;
        fieldValueHash: string | null;
        sourceType: string;
        sourceReference: string | null;
        legalBasis: string;
        allowedUses: string[];
        prohibitedUses: string[];
        confidenceScore: number | null;
        visibilityRoles: string[];
        capturedAt: Date;
        lastValidatedAt: Date | null;
        expirationDate: Date | null;
    }>;
    update(id: string, data: UpdateDataPassportDto, user: AuthenticatedUser): Promise<{
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.PassportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        entityType: string;
        entityId: string;
        fieldName: string;
        fieldValueHash: string | null;
        sourceType: string;
        sourceReference: string | null;
        legalBasis: string;
        allowedUses: string[];
        prohibitedUses: string[];
        confidenceScore: number | null;
        visibilityRoles: string[];
        capturedAt: Date;
        lastValidatedAt: Date | null;
        expirationDate: Date | null;
    }>;
    revoke(id: string, user: AuthenticatedUser): Promise<{
        status: import("@prisma/client").$Enums.PassportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        entityType: string;
        entityId: string;
        fieldName: string;
        fieldValueHash: string | null;
        sourceType: string;
        sourceReference: string | null;
        legalBasis: string;
        allowedUses: string[];
        prohibitedUses: string[];
        confidenceScore: number | null;
        visibilityRoles: string[];
        capturedAt: Date;
        lastValidatedAt: Date | null;
        expirationDate: Date | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        status: import("@prisma/client").$Enums.PassportStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        caseId: string;
        entityType: string;
        entityId: string;
        fieldName: string;
        fieldValueHash: string | null;
        sourceType: string;
        sourceReference: string | null;
        legalBasis: string;
        allowedUses: string[];
        prohibitedUses: string[];
        confidenceScore: number | null;
        visibilityRoles: string[];
        capturedAt: Date;
        lastValidatedAt: Date | null;
        expirationDate: Date | null;
    }>;
    private assertTenant;
}
