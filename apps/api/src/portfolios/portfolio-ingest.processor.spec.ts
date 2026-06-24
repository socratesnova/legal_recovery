import { Job } from "bullmq";
import { AuditAction } from "@prisma/client";
import { PortfolioIngestProcessor } from "./portfolio-ingest.processor";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestJobPayload } from "./portfolio-ingest.producer";
import { StorageService } from "../common/services/storage.service";
import { PrismaService } from "../common/prisma.service";

const data: PortfolioIngestJobPayload = {
  jobId: "job-1",
  storageKey: "k",
  portfolioId: "p1",
  institutionId: "inst1",
  userId: "u1",
  fileName: "f.csv",
  mimeType: "text/csv",
};

describe("PortfolioIngestProcessor", () => {
  let prisma: { auditLog: { create: jest.Mock } };
  let storage: { get: jest.Mock };
  let ingest: {
    parse: jest.Mock;
    processRows: jest.Mock;
    finalizeIngest: jest.Mock;
  };
  let jobs: {
    markRunning: jest.Mock;
    markSucceeded: jest.Mock;
    markFailed: jest.Mock;
  };
  let processor: PortfolioIngestProcessor;

  const makeJob = () => ({ data }) as unknown as Job<PortfolioIngestJobPayload>;

  beforeEach(() => {
    prisma = { auditLog: { create: jest.fn().mockResolvedValue({}) } };
    storage = { get: jest.fn().mockResolvedValue(Buffer.from("csv")) };
    ingest = {
      parse: jest.fn().mockResolvedValue([{ idNumber: "001" }]),
      processRows: jest
        .fn()
        .mockImplementation(
          async (
            _rows: unknown,
            _p: unknown,
            summary: { casesCreated: number },
          ) => {
            summary.casesCreated = 1;
          },
        ),
      finalizeIngest: jest.fn().mockResolvedValue(undefined),
    };
    jobs = {
      markRunning: jest.fn().mockResolvedValue({}),
      markSucceeded: jest.fn().mockResolvedValue({}),
      markFailed: jest.fn().mockResolvedValue({}),
    };
    processor = new PortfolioIngestProcessor(
      prisma as unknown as PrismaService,
      storage as unknown as StorageService,
      ingest as unknown as PortfolioIngestService,
      jobs as unknown as PortfolioIngestJobService,
    );
  });

  it("runs the full pipeline, marks SUCCEEDED and writes an audit log", async () => {
    await processor.process(makeJob());

    expect(jobs.markRunning).toHaveBeenCalledWith("job-1");
    expect(storage.get).toHaveBeenCalledWith("k");
    expect(ingest.parse).toHaveBeenCalled();
    expect(ingest.processRows).toHaveBeenCalled();
    expect(ingest.finalizeIngest).toHaveBeenCalledWith(
      { id: "p1", institutionId: "inst1" },
      expect.objectContaining({ portfolioId: "p1", casesCreated: 1 }),
      "k",
    );
    expect(jobs.markSucceeded).toHaveBeenCalledWith(
      "job-1",
      expect.objectContaining({ casesCreated: 1 }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: AuditAction.CREATE,
          entityType: "PortfolioIngestJob",
          entityId: "job-1",
          userId: "u1",
          institutionId: "inst1",
        }),
      }),
    );
    expect(jobs.markFailed).not.toHaveBeenCalled();
  });

  it("marks FAILED and rethrows when the storage read fails", async () => {
    storage.get.mockRejectedValue(new Error("storage down"));
    await expect(processor.process(makeJob())).rejects.toThrow("storage down");
    expect(jobs.markFailed).toHaveBeenCalledWith("job-1", expect.any(Error));
    expect(jobs.markSucceeded).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("marks FAILED and rethrows when row processing fails", async () => {
    ingest.processRows.mockRejectedValue(new Error("db down"));
    await expect(processor.process(makeJob())).rejects.toThrow("db down");
    expect(jobs.markFailed).toHaveBeenCalledWith("job-1", expect.any(Error));
    expect(jobs.markSucceeded).not.toHaveBeenCalled();
  });
});
