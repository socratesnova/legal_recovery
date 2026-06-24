import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { IngestSummary } from "./portfolio-ingest.service";
import {
  AuthenticatedUser,
  UserRole,
} from "../common/decorators/current-user.decorator";

export interface CreateIngestJobInput {
  portfolioId: string;
  institutionId: string;
  storageKey: string;
  fileName: string;
  mimeType: string;
  startedBy?: string;
}

/**
 * CRUD over {@link PortfolioIngestJob} rows. Reads are tenant-scoped to the
 * caller: each job row carries the institution id (set at enqueue time, after
 * the tenant guard) so we can scope without an extra join. Used by the producer
 * (create), the BullMQ processor (status transitions), and the controller
 * (list/get status).
 */
@Injectable()
export class PortfolioIngestJobService {
  constructor(private prisma: PrismaService) {}

  createPending(input: CreateIngestJobInput) {
    return this.prisma.portfolioIngestJob.create({
      data: { ...input, status: "PENDING" },
    });
  }

  markRunning(id: string) {
    return this.prisma.portfolioIngestJob.update({
      where: { id },
      data: { status: "RUNNING" },
    });
  }

  markSucceeded(id: string, summary: IngestSummary) {
    return this.prisma.portfolioIngestJob.update({
      where: { id },
      data: {
        status: "SUCCEEDED",
        rowsProcessed: summary.rowsProcessed,
        casesCreated: summary.casesCreated,
        debtorsCreated: summary.debtorsCreated,
        debtorsReused: summary.debtorsReused,
        skipped: summary.skipped,
        errors: summary.errors,
        finishedAt: new Date(),
        errorMessage: null,
      },
    });
  }

  markFailed(id: string, error: unknown) {
    return this.prisma.portfolioIngestJob.update({
      where: { id },
      data: {
        status: "FAILED",
        errorMessage: (error as Error)?.message ?? "unknown error",
        finishedAt: new Date(),
      },
    });
  }

  /** List ingest jobs for a portfolio, tenant-scoped to the caller. */
  async findByPortfolio(portfolioId: string, user: AuthenticatedUser) {
    const where: { portfolioId: string; institutionId?: string } = {
      portfolioId,
    };
    if (user.role !== UserRole.SUPER_ADMIN) {
      if (!user.institutionId) {
        throw new ForbiddenException("User is not assigned to any institution");
      }
      where.institutionId = user.institutionId;
    }
    return this.prisma.portfolioIngestJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  /** Fetch one ingest job, bound to the portfolio and tenant-scoped to the caller. */
  async findOne(portfolioId: string, jobId: string, user: AuthenticatedUser) {
    const job = await this.prisma.portfolioIngestJob.findUnique({
      where: { id: jobId },
    });
    if (!job || job.portfolioId !== portfolioId) {
      throw new NotFoundException("Ingest job not found");
    }
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      job.institutionId !== user.institutionId
    ) {
      throw new ForbiddenException(
        "Ingest job does not belong to your institution",
      );
    }
    return job;
  }
}
