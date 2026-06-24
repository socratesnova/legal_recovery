import { PrismaService } from "../common/prisma.service";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class PortfoliosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser): Promise<({
        institution: {
            name: string;
            id: string;
        };
        _count: {
            cases: number;
        };
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
        cases: ({
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
        })[];
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
    }>;
    create(data: CreatePortfolioDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
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
    }>;
    update(id: string, data: UpdatePortfolioDto, user: AuthenticatedUser): Promise<{
        institution: {
            name: string;
            id: string;
        };
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
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
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
    }>;
}
