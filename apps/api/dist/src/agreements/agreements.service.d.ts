import { PrismaService } from "../common/prisma.service";
import { PortfolioRulesService } from "../rules/portfolio-rules.service";
import { CreateAgreementDto } from "./dto/create-agreement.dto";
import { UpdateAgreementDto } from "./dto/update-agreement.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class AgreementsService {
    private prisma;
    private rulesService;
    constructor(prisma: PrismaService, rulesService: PortfolioRulesService);
    findAll(caseId: string | undefined, user: AuthenticatedUser): Promise<({
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
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
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
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
    }>;
    create(data: CreateAgreementDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
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
    }>;
    update(id: string, data: UpdateAgreementDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
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
    }>;
    approve(id: string, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
        case: {
            id: string;
            caseNumber: string;
        };
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
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
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
    }>;
}
