import { PortfoliosService } from "./portfolios.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestProducer } from "./portfolio-ingest.producer";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioRulesService } from "../rules/portfolio-rules.service";
import { UpsertPortfolioRuleDto } from "../rules/dto/upsert-portfolio-rule.dto";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class PortfoliosController {
    private readonly portfoliosService;
    private readonly ingestService;
    private readonly ingestProducer;
    private readonly ingestJobs;
    private readonly rulesService;
    constructor(portfoliosService: PortfoliosService, ingestService: PortfolioIngestService, ingestProducer: PortfolioIngestProducer, ingestJobs: PortfolioIngestJobService, rulesService: PortfolioRulesService);
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
    upload(id: string, file: Express.Multer.File | undefined, user: AuthenticatedUser): Promise<import("./portfolio-ingest.service").IngestSummary>;
    ingestAsync(id: string, file: Express.Multer.File | undefined, user: AuthenticatedUser): Promise<import("./portfolio-ingest.producer").EnqueueResult>;
    listIngestJobs(id: string, user: AuthenticatedUser): Promise<{
        institutionId: string;
        status: import("@prisma/client").$Enums.IngestJobStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        portfolioId: string;
        mimeType: string;
        storageKey: string;
        fileName: string;
        rowsProcessed: number;
        casesCreated: number;
        debtorsCreated: number;
        debtorsReused: number;
        skipped: number;
        errors: import("@prisma/client/runtime/library").JsonValue | null;
        startedBy: string | null;
        errorMessage: string | null;
        finishedAt: Date | null;
    }[]>;
    getIngestJob(id: string, jobId: string, user: AuthenticatedUser): Promise<{
        institutionId: string;
        status: import("@prisma/client").$Enums.IngestJobStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        portfolioId: string;
        mimeType: string;
        storageKey: string;
        fileName: string;
        rowsProcessed: number;
        casesCreated: number;
        debtorsCreated: number;
        debtorsReused: number;
        skipped: number;
        errors: import("@prisma/client/runtime/library").JsonValue | null;
        startedBy: string | null;
        errorMessage: string | null;
        finishedAt: Date | null;
    }>;
    getRules(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minInstallments: number | null;
        maxInstallments: number | null;
        autoApprovalLimit: import("@prisma/client/runtime/library").Decimal | null;
        portfolioId: string;
        discountMax: import("@prisma/client/runtime/library").Decimal | null;
        channelsAllowed: string[];
    }>;
    upsertRules(id: string, data: UpsertPortfolioRuleDto, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minInstallments: number | null;
        maxInstallments: number | null;
        autoApprovalLimit: import("@prisma/client/runtime/library").Decimal | null;
        portfolioId: string;
        discountMax: import("@prisma/client/runtime/library").Decimal | null;
        channelsAllowed: string[];
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
