import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Prisma, AuditAction } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import { StorageService } from "../common/services/storage.service";
import {
  PortfolioIngestService,
  IngestSummary,
} from "./portfolio-ingest.service";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioIngestJobPayload } from "./portfolio-ingest.producer";
import { PORTFOLIO_INGEST_QUEUE } from "./portfolio-ingest.constants";

/**
 * Consumes {@link PORTFOLIO_INGEST_QUEUE} jobs: reads the uploaded file back
 * from object storage, parses + ingests rows out-of-request (so large files do
 * not block the HTTP call), updates the {@link PortfolioIngestJob} row through
 * its lifecycle, and writes an immutable audit log entry on completion
 * (business rule #6 — async jobs are not covered by the HTTP AuditInterceptor).
 */
@Injectable()
@Processor(PORTFOLIO_INGEST_QUEUE)
export class PortfolioIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(PortfolioIngestProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly ingest: PortfolioIngestService,
    private readonly jobs: PortfolioIngestJobService,
  ) {
    super();
  }

  async process(
    job: Job<PortfolioIngestJobPayload>,
    _token?: string,
  ): Promise<void> {
    const data = job.data;
    this.logger.log(
      `Processing ingest job ${data.jobId} for portfolio ${data.portfolioId}`,
    );
    await this.jobs.markRunning(data.jobId);
    try {
      const buffer = await this.storage.get(data.storageKey);
      const rows = await this.ingest.parse(buffer, data.fileName);

      const portfolio = {
        id: data.portfolioId,
        institutionId: data.institutionId,
      };
      const summary: IngestSummary = {
        portfolioId: data.portfolioId,
        rowsProcessed: rows.length,
        casesCreated: 0,
        debtorsCreated: 0,
        debtorsReused: 0,
        skipped: 0,
        errors: [],
        storageKey: data.storageKey,
      };

      await this.ingest.processRows(rows, portfolio, summary);
      await this.ingest.finalizeIngest(portfolio, summary, data.storageKey);
      await this.jobs.markSucceeded(data.jobId, summary);
      await this.audit(data, summary);
    } catch (err) {
      this.logger.error(
        `Ingest job ${data.jobId} failed: ${(err as Error)?.message ?? err}`,
      );
      await this.jobs.markFailed(data.jobId, err);
      // Re-throw so BullMQ marks the job failed; attempts: 1 -> no retry.
      throw err;
    }
  }

  /** Immutable audit log entry for the completed async ingest. */
  private async audit(
    data: PortfolioIngestJobPayload,
    summary: IngestSummary,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          institutionId: data.institutionId,
          action: AuditAction.CREATE,
          entityType: "PortfolioIngestJob",
          entityId: data.jobId,
          changesJson: {
            portfolioId: data.portfolioId,
            fileName: data.fileName,
            rowsProcessed: summary.rowsProcessed,
            casesCreated: summary.casesCreated,
            debtorsCreated: summary.debtorsCreated,
            debtorsReused: summary.debtorsReused,
            skipped: summary.skipped,
            errors: summary.errors,
          } as unknown as Prisma.InputJsonValue,
          userAgent: "portfolio-ingest-worker",
        },
      });
    } catch (err) {
      // Audit logging must never break the job outcome (mirrors AuditInterceptor).
      this.logger.error(
        `Audit log for ingest job ${data.jobId} failed: ${(err as Error)?.message ?? err}`,
      );
    }
  }
}
