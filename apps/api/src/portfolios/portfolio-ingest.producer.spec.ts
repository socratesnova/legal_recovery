import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { Queue } from "bullmq";
import { PortfolioIngestProducer } from "./portfolio-ingest.producer";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { StorageService } from "../common/services/storage.service";
import { UserRole } from "../common/decorators/current-user.decorator";

const admin = {
  userId: "u1",
  email: "a@b.c",
  role: UserRole.ADMIN,
  institutionId: "inst1",
};

const file = {
  originalname: "big.csv",
  buffer: Buffer.from("cedula;nombres;apellidos;saldo\n001;Juan;P;100"),
  mimetype: "text/csv",
  size: 40,
} as unknown as Express.Multer.File;

describe("PortfolioIngestProducer", () => {
  let queue: { add: jest.Mock };
  let storage: { buildKey: jest.Mock; put: jest.Mock };
  let ingest: { assertPortfolioInTenant: jest.Mock };
  let jobs: { createPending: jest.Mock };
  let producer: PortfolioIngestProducer;

  beforeEach(() => {
    queue = { add: jest.fn().mockResolvedValue({ id: "bull-1" }) };
    storage = {
      buildKey: jest.fn().mockReturnValue("portfolios/p1/x/big.csv"),
      put: jest.fn().mockResolvedValue({ key: "k" }),
    };
    ingest = {
      assertPortfolioInTenant: jest.fn().mockResolvedValue({
        id: "p1",
        institutionId: "inst1",
      }),
    };
    jobs = {
      createPending: jest
        .fn()
        .mockResolvedValue({ id: "job-1", status: "PENDING" }),
    };
    producer = new PortfolioIngestProducer(
      queue as unknown as Queue,
      storage as unknown as StorageService,
      ingest as unknown as PortfolioIngestService,
      jobs as unknown as PortfolioIngestJobService,
    );
  });

  it("asserts tenant, stores, creates a PENDING job and enqueues", async () => {
    const res = await producer.enqueue(file, "p1", admin);

    expect(ingest.assertPortfolioInTenant).toHaveBeenCalledWith("p1", admin);
    expect(storage.put).toHaveBeenCalledWith(
      "portfolios/p1/x/big.csv",
      file.buffer,
      "text/csv",
    );
    expect(jobs.createPending).toHaveBeenCalledWith(
      expect.objectContaining({
        portfolioId: "p1",
        institutionId: "inst1",
        storageKey: "portfolios/p1/x/big.csv",
        fileName: "big.csv",
        startedBy: "u1",
      }),
    );
    expect(queue.add).toHaveBeenCalledWith(
      "ingest",
      expect.objectContaining({
        jobId: "job-1",
        storageKey: "portfolios/p1/x/big.csv",
        portfolioId: "p1",
        institutionId: "inst1",
        userId: "u1",
      }),
      expect.objectContaining({ attempts: 1 }),
    );
    expect(res).toEqual({
      jobId: "job-1",
      status: "PENDING",
      portfolioId: "p1",
    });
  });

  it("propagates 404 when the portfolio does not exist (before storing)", async () => {
    ingest.assertPortfolioInTenant.mockRejectedValue(
      new NotFoundException("Portfolio not found"),
    );
    await expect(producer.enqueue(file, "p1", admin)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(storage.put).not.toHaveBeenCalled();
    expect(jobs.createPending).not.toHaveBeenCalled();
    expect(queue.add).not.toHaveBeenCalled();
  });

  it("propagates 403 when the portfolio belongs to another tenant", async () => {
    ingest.assertPortfolioInTenant.mockRejectedValue(
      new ForbiddenException("Portfolio does not belong to your institution"),
    );
    await expect(producer.enqueue(file, "p1", admin)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(storage.put).not.toHaveBeenCalled();
  });
});
