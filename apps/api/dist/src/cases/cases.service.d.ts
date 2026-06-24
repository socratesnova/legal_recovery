import { PrismaService } from "../common/prisma.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { CaseFilterDto } from "./dto/filter-case.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class CasesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filter: CaseFilterDto, user: AuthenticatedUser): Promise<({
        institution: {
            name: string;
            id: string;
        };
        portfolio: {
            name: string;
            id: string;
        };
        debtor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            idNumber: string;
            idType: string;
        };
        _count: {
            agreements: number;
            payments: number;
            documents: number;
            communications: number;
            disputes: number;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            caseId: string;
            productType: string;
            originalAmount: import("@prisma/client/runtime/library").Decimal;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
            interestRate: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.CaseStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        portfolioId: string;
        debtorId: string;
        caseNumber: string;
        totalBalance: import("@prisma/client/runtime/library").Decimal;
        assignedDate: Date;
        nextAction: string | null;
        nextActionDate: Date | null;
        scoreDocumental: number | null;
        scoreRecoverability: number | null;
        scoreContactability: number | null;
        scoreRisk: number | null;
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            status: import("@prisma/client").$Enums.EntityStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.InstitutionType;
            taxId: string | null;
            country: string;
            maxDiscountAuto: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscountManual: import("@prisma/client/runtime/library").Decimal | null;
            minInstallments: number | null;
            maxInstallments: number | null;
            autoApprovalLimit: import("@prisma/client/runtime/library").Decimal | null;
        };
        portfolio: {
            rules: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                minInstallments: number | null;
                maxInstallments: number | null;
                autoApprovalLimit: import("@prisma/client/runtime/library").Decimal | null;
                portfolioId: string;
                discountMax: import("@prisma/client/runtime/library").Decimal | null;
                channelsAllowed: string[];
            };
        } & {
            name: string;
            institutionId: string;
            status: import("@prisma/client").$Enums.PortfolioStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.PortfolioType;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            fileSource: string | null;
            uploadDate: Date;
        };
        debtor: {
            contacts: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                debtorId: string;
                channel: import("@prisma/client").$Enums.ContactChannel;
                value: string;
                isPrimary: boolean;
                optIn: boolean;
                optInDate: Date | null;
                dataPassportId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            idNumber: string;
            idType: string;
        };
        agreements: ({
            promises: {
                status: import("@prisma/client").$Enums.PromiseStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                agreementId: string;
                promisedDate: Date;
                promisedAmount: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            institutionId: string;
            status: import("@prisma/client").$Enums.AgreementStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            type: import("@prisma/client").$Enums.AgreementType;
            caseId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            discountPercentage: import("@prisma/client/runtime/library").Decimal | null;
            installments: number | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            createdBy: string;
        })[];
        payments: {
            institutionId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            caseId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            agreementId: string | null;
            method: import("@prisma/client").$Enums.PaymentMethod;
            reference: string | null;
            receiptPath: string | null;
            reconciledAt: Date | null;
            reconciledBy: string | null;
        }[];
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            caseId: string;
            productType: string;
            originalAmount: import("@prisma/client/runtime/library").Decimal;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
            interestRate: import("@prisma/client/runtime/library").Decimal | null;
        }[];
        documents: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            caseId: string;
            mimeType: string;
            uploadedBy: string;
            filename: string;
            filePath: string;
            fileHash: string;
            sizeBytes: number;
        }[];
        communications: {
            status: import("@prisma/client").$Enums.CommStatus;
            userId: string | null;
            id: string;
            createdAt: Date;
            caseId: string;
            ipAddress: string | null;
            contactId: string | null;
            channel: import("@prisma/client").$Enums.CommChannel;
            direction: import("@prisma/client").$Enums.CommDirection;
            contentSummary: string | null;
            blocked: boolean;
            blockReason: string | null;
            providerMessageId: string | null;
            simulated: boolean;
        }[];
        disputes: {
            status: import("@prisma/client").$Enums.DisputeStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            caseId: string;
            reason: string;
            openedBy: string;
            openedAt: Date;
            resolvedBy: string | null;
            resolvedAt: Date | null;
            resolution: string | null;
        }[];
        dataPassports: {
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
        }[];
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.CaseStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        portfolioId: string;
        debtorId: string;
        caseNumber: string;
        totalBalance: import("@prisma/client/runtime/library").Decimal;
        assignedDate: Date;
        nextAction: string | null;
        nextActionDate: Date | null;
        scoreDocumental: number | null;
        scoreRecoverability: number | null;
        scoreContactability: number | null;
        scoreRisk: number | null;
    }>;
    create(data: CreateCaseDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        portfolio: {
            name: string;
            id: string;
        };
        debtor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            idNumber: string;
            idType: string;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            caseId: string;
            productType: string;
            originalAmount: import("@prisma/client/runtime/library").Decimal;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
            interestRate: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.CaseStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        portfolioId: string;
        debtorId: string;
        caseNumber: string;
        totalBalance: import("@prisma/client/runtime/library").Decimal;
        assignedDate: Date;
        nextAction: string | null;
        nextActionDate: Date | null;
        scoreDocumental: number | null;
        scoreRecoverability: number | null;
        scoreContactability: number | null;
        scoreRisk: number | null;
    }>;
    update(id: string, data: UpdateCaseDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        portfolio: {
            name: string;
            id: string;
        };
        debtor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            idNumber: string;
            idType: string;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            caseId: string;
            productType: string;
            originalAmount: import("@prisma/client/runtime/library").Decimal;
            currentBalance: import("@prisma/client/runtime/library").Decimal;
            interestRate: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        institutionId: string;
        status: import("@prisma/client").$Enums.CaseStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        portfolioId: string;
        debtorId: string;
        caseNumber: string;
        totalBalance: import("@prisma/client/runtime/library").Decimal;
        assignedDate: Date;
        nextAction: string | null;
        nextActionDate: Date | null;
        scoreDocumental: number | null;
        scoreRecoverability: number | null;
        scoreContactability: number | null;
        scoreRisk: number | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        institutionId: string;
        status: import("@prisma/client").$Enums.CaseStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        portfolioId: string;
        debtorId: string;
        caseNumber: string;
        totalBalance: import("@prisma/client/runtime/library").Decimal;
        assignedDate: Date;
        nextAction: string | null;
        nextActionDate: Date | null;
        scoreDocumental: number | null;
        scoreRecoverability: number | null;
        scoreContactability: number | null;
        scoreRisk: number | null;
    }>;
}
