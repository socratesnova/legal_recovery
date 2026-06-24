import { Queue } from "bullmq";
import { StorageService } from "../common/services/storage.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export interface EnqueueResult {
    jobId: string;
    status: string;
    portfolioId: string;
}
export interface PortfolioIngestJobPayload {
    jobId: string;
    storageKey: string;
    portfolioId: string;
    institutionId: string;
    userId?: string;
    fileName: string;
    mimeType: string;
}
export declare class PortfolioIngestProducer {
    private readonly queue;
    private readonly storage;
    private readonly ingest;
    private readonly jobs;
    private readonly logger;
    constructor(queue: Queue, storage: StorageService, ingest: PortfolioIngestService, jobs: PortfolioIngestJobService);
    enqueue(file: Express.Multer.File, portfolioId: string, user: AuthenticatedUser): Promise<EnqueueResult>;
}
