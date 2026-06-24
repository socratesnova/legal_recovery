import { NotFoundException, ForbiddenException } from "@nestjs/common";
import {
  PortfolioIngestJobService,
  CreateIngestJobInput,
} from "./portfolio-ingest-job.service";
import { IngestSummary } from "./portfolio-ingest.service";
import { PrismaService } from "../common/prisma.service";
import { UserRole } from "../common/decorators/current-user.decorator";

const admin = {
  userId: "u1",
  email: "a@b.c",
  role: UserRole.ADMIN,
  institutionId: "inst1",
};

const superAdmin = {
  userId: "u2",
  email: "s@b.c",
  role: UserRole.SUPER_ADMIN,
};

describe("PortfolioIngestJobService", () => {
  let prisma: {
    portfolioIngestJob: {
      create: jest.Mock;
      update: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };
  let service: PortfolioIngestJobService;

  beforeEach(() => {
    prisma = {
      portfolioIngestJob: {
        create: jest.fn().mockResolvedValue({ id: "j1", status: "PENDING" }),
        update: jest.fn().mockResolvedValue({ id: "j1" }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    service = new PortfolioIngestJobService(prisma as unknown as PrismaService);
  });

  const input: CreateIngestJobInput = {
    portfolioId: "p1",
    institutionId: "inst1",
    storageKey: "k",
    fileName: "f.csv",
    mimeType: "text/csv",
    startedBy: "u1",
  };

  it("createPending creates a job with status PENDING", async () => {
    await service.createPending(input);
    expect(prisma.portfolioIngestJob.create).toHaveBeenCalledWith({
      data: { ...input, status: "PENDING" },
    });
  });

  it("markRunning transitions to RUNNING", async () => {
    await service.markRunning("j1");
    expect(prisma.portfolioIngestJob.update).toHaveBeenCalledWith({
      where: { id: "j1" },
      data: { status: "RUNNING" },
    });
  });

  it("markSucceeded writes the summary, errors and finishedAt", async () => {
    const summary: IngestSummary = {
      portfolioId: "p1",
      rowsProcessed: 10,
      casesCreated: 8,
      debtorsCreated: 5,
      debtorsReused: 3,
      skipped: 2,
      errors: ["Row 3: bad"],
      storageKey: "k",
    };
    await service.markSucceeded("j1", summary);
    const call = prisma.portfolioIngestJob.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: "j1" });
    expect(call.data.status).toBe("SUCCEEDED");
    expect(call.data.casesCreated).toBe(8);
    expect(call.data.errors).toEqual(["Row 3: bad"]);
    expect(call.data.finishedAt).toBeInstanceOf(Date);
    expect(call.data.errorMessage).toBeNull();
  });

  it("markFailed records the error message and finishedAt", async () => {
    await service.markFailed("j1", new Error("boom"));
    const call = prisma.portfolioIngestJob.update.mock.calls[0][0];
    expect(call.data.status).toBe("FAILED");
    expect(call.data.errorMessage).toBe("boom");
    expect(call.data.finishedAt).toBeInstanceOf(Date);
  });

  it("markFailed falls back to a generic message for non-Error throws", async () => {
    await service.markFailed("j1", "wat");
    expect(
      prisma.portfolioIngestJob.update.mock.calls[0][0].data.errorMessage,
    ).toBe("unknown error");
  });

  it("findByPortfolio scopes non-super-admin to their institution", async () => {
    await service.findByPortfolio("p1", admin);
    expect(prisma.portfolioIngestJob.findMany).toHaveBeenCalledWith({
      where: { portfolioId: "p1", institutionId: "inst1" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("findByPortfolio lets super_admin see all jobs for the portfolio", async () => {
    await service.findByPortfolio("p1", superAdmin);
    expect(prisma.portfolioIngestJob.findMany).toHaveBeenCalledWith({
      where: { portfolioId: "p1" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("findByPortfolio rejects a non-super-admin with no institution", async () => {
    const noInst = {
      userId: "u",
      email: "a@b.c",
      role: UserRole.GESTOR,
    };
    await expect(service.findByPortfolio("p1", noInst)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it("findOne throws 404 when the job does not exist", async () => {
    prisma.portfolioIngestJob.findUnique.mockResolvedValue(null);
    await expect(service.findOne("p1", "j1", admin)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("findOne throws 404 when the job belongs to a different portfolio", async () => {
    prisma.portfolioIngestJob.findUnique.mockResolvedValue({
      id: "j1",
      portfolioId: "other",
      institutionId: "inst1",
      status: "PENDING",
    });
    await expect(service.findOne("p1", "j1", admin)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("findOne throws 403 when the job belongs to another institution", async () => {
    prisma.portfolioIngestJob.findUnique.mockResolvedValue({
      id: "j1",
      portfolioId: "p1",
      institutionId: "other",
      status: "PENDING",
    });
    await expect(service.findOne("p1", "j1", admin)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it("findOne returns the job for the owner", async () => {
    const row = {
      id: "j1",
      portfolioId: "p1",
      institutionId: "inst1",
      status: "SUCCEEDED",
    };
    prisma.portfolioIngestJob.findUnique.mockResolvedValue(row);
    await expect(service.findOne("p1", "j1", admin)).resolves.toEqual(row);
  });

  it("findOne lets super_admin read any job", async () => {
    const row = {
      id: "j1",
      portfolioId: "p1",
      institutionId: "instX",
      status: "SUCCEEDED",
    };
    prisma.portfolioIngestJob.findUnique.mockResolvedValue(row);
    await expect(service.findOne("p1", "j1", superAdmin)).resolves.toEqual(row);
  });
});
