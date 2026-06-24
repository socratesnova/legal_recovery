import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export interface IngestRow {
    idNumber: string;
    firstName: string;
    lastName: string;
    caseNumber?: string;
    totalBalance: number;
    productType?: string;
    originalAmount?: number;
    currentBalance?: number;
    interestRate?: number;
}
export interface IngestSummary {
    portfolioId: string;
    rowsProcessed: number;
    casesCreated: number;
    debtorsCreated: number;
    debtorsReused: number;
    skipped: number;
    errors: string[];
    storageKey?: string;
}
export declare class PortfolioIngestService {
    private prisma;
    private storage;
    private readonly logger;
    constructor(prisma: PrismaService, storage: StorageService);
    ingest(file: Express.Multer.File, portfolioId: string, user: AuthenticatedUser): Promise<IngestSummary>;
    processRows(rows: IngestRow[], portfolio: {
        id: string;
        institutionId: string;
    }, summary: IngestSummary): Promise<void>;
    finalizeIngest(portfolio: {
        id: string;
        institutionId: string;
    }, summary: IngestSummary, storageKey: string): Promise<void>;
    private ingestRow;
    parse(buffer: Buffer, filename: string): Promise<IngestRow[]>;
    private parseCsv;
    private parseXlsx;
    normalizeRow(raw: Record<string, string>): IngestRow | null;
    private canonicalHeader;
    toNumber(value: string): number | null;
    private isUniqueViolation;
    assertPortfolioInTenant(portfolioId: string, user: AuthenticatedUser): Promise<{
        id: string;
        institutionId: string;
    }>;
}
