import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioIngestJobPayload } from "./portfolio-ingest.producer";
export declare class PortfolioIngestProcessor extends WorkerHost {
    private readonly prisma;
    private readonly storage;
    private readonly ingest;
    private readonly jobs;
    private readonly logger;
    constructor(prisma: PrismaService, storage: StorageService, ingest: PortfolioIngestService, jobs: PortfolioIngestJobService);
    process(job: Job<PortfolioIngestJobPayload>, _token?: string): Promise<void>;
    private audit;
}
