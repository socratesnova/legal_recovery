-- PortfolioIngestJob: tracks async (BullMQ) portfolio uploads so large files
-- (>10k rows) are processed out-of-request and their progress is queryable.
-- institution_id is denormalized from the portfolio (set at enqueue time, after
-- the tenant assert) so job rows can be tenant-scoped without a join.

-- CreateEnum
CREATE TYPE "IngestJobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "portfolio_ingest_jobs" (
    "id" UUID NOT NULL,
    "portfolio_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "storage_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" "IngestJobStatus" NOT NULL DEFAULT 'PENDING',
    "rows_processed" INTEGER NOT NULL DEFAULT 0,
    "cases_created" INTEGER NOT NULL DEFAULT 0,
    "debtors_created" INTEGER NOT NULL DEFAULT 0,
    "debtors_reused" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "started_by" UUID,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "portfolio_ingest_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolio_ingest_jobs_portfolio_id_idx" ON "portfolio_ingest_jobs"("portfolio_id");

-- CreateIndex
CREATE INDEX "portfolio_ingest_jobs_institution_id_status_idx" ON "portfolio_ingest_jobs"("institution_id", "status");

-- AddForeignKey
ALTER TABLE "portfolio_ingest_jobs" ADD CONSTRAINT "portfolio_ingest_jobs_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;