import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { StorageService } from "../common/services/storage.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import {
  PORTFOLIO_INGEST_QUEUE,
  PORTFOLIO_INGEST_JOB_NAME,
} from "./portfolio-ingest.constants";

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

/**
 * Enqueues async portfolio ingest jobs. The tenant guard
 * ({@link PortfolioIngestService.assertPortfolioInTenant}) runs FIRST so a
 * 404/403 is returned synchronously to the caller rather than after enqueuing.
 * The raw upload is persisted to object storage and the BullMQ job references it
 * by key, so the worker process never holds the HTTP payload in memory.
 */
@Injectable()
export class PortfolioIngestProducer {
  private readonly logger = new Logger(PortfolioIngestProducer.name);

  constructor(
    @InjectQueue(PORTFOLIO_INGEST_QUEUE) private readonly queue: Queue,
    private readonly storage: StorageService,
    private readonly ingest: PortfolioIngestService,
    private readonly jobs: PortfolioIngestJobService,
  ) {}

  async enqueue(
    file: Express.Multer.File,
    portfolioId: string,
    user: AuthenticatedUser,
  ): Promise<EnqueueResult> {
    const portfolio = await this.ingest.assertPortfolioInTenant(
      portfolioId,
      user,
    );

    const storageKey = this.storage.buildKey(
      `portfolios/${portfolio.id}`,
      file.originalname,
    );
    await this.storage.put(storageKey, file.buffer, file.mimetype);

    const job = await this.jobs.createPending({
      portfolioId: portfolio.id,
      institutionId: portfolio.institutionId,
      storageKey,
      fileName: file.originalname,
      mimeType: file.mimetype,
      startedBy: user.userId,
    });

    const payload: PortfolioIngestJobPayload = {
      jobId: job.id,
      storageKey,
      portfolioId: portfolio.id,
      institutionId: portfolio.institutionId,
      userId: user.userId,
      fileName: file.originalname,
      mimeType: file.mimetype,
    };

    // attempts: 1 -> no automatic retry; the job row already records FAILED.
    // Keep completed/failed jobs so operators can inspect them.
    await this.queue.add(PORTFOLIO_INGEST_JOB_NAME, payload, {
      attempts: 1,
      removeOnComplete: false,
      removeOnFail: false,
    });

    this.logger.log(
      `Enqueued async ingest job ${job.id} for portfolio ${portfolio.id} (${file.originalname})`,
    );
    return { jobId: job.id, status: job.status, portfolioId: portfolio.id };
  }
}
