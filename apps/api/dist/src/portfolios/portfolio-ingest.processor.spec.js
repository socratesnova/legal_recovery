"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const portfolio_ingest_processor_1 = require("./portfolio-ingest.processor");
const data = {
    jobId: "job-1",
    storageKey: "k",
    portfolioId: "p1",
    institutionId: "inst1",
    userId: "u1",
    fileName: "f.csv",
    mimeType: "text/csv",
};
describe("PortfolioIngestProcessor", () => {
    let prisma;
    let storage;
    let ingest;
    let jobs;
    let processor;
    const makeJob = () => ({ data });
    beforeEach(() => {
        prisma = { auditLog: { create: jest.fn().mockResolvedValue({}) } };
        storage = { get: jest.fn().mockResolvedValue(Buffer.from("csv")) };
        ingest = {
            parse: jest.fn().mockResolvedValue([{ idNumber: "001" }]),
            processRows: jest
                .fn()
                .mockImplementation(async (_rows, _p, summary) => {
                summary.casesCreated = 1;
            }),
            finalizeIngest: jest.fn().mockResolvedValue(undefined),
        };
        jobs = {
            markRunning: jest.fn().mockResolvedValue({}),
            markSucceeded: jest.fn().mockResolvedValue({}),
            markFailed: jest.fn().mockResolvedValue({}),
        };
        processor = new portfolio_ingest_processor_1.PortfolioIngestProcessor(prisma, storage, ingest, jobs);
    });
    it("runs the full pipeline, marks SUCCEEDED and writes an audit log", async () => {
        await processor.process(makeJob());
        expect(jobs.markRunning).toHaveBeenCalledWith("job-1");
        expect(storage.get).toHaveBeenCalledWith("k");
        expect(ingest.parse).toHaveBeenCalled();
        expect(ingest.processRows).toHaveBeenCalled();
        expect(ingest.finalizeIngest).toHaveBeenCalledWith({ id: "p1", institutionId: "inst1" }, expect.objectContaining({ portfolioId: "p1", casesCreated: 1 }), "k");
        expect(jobs.markSucceeded).toHaveBeenCalledWith("job-1", expect.objectContaining({ casesCreated: 1 }));
        expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                action: client_1.AuditAction.CREATE,
                entityType: "PortfolioIngestJob",
                entityId: "job-1",
                userId: "u1",
                institutionId: "inst1",
            }),
        }));
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
//# sourceMappingURL=portfolio-ingest.processor.spec.js.map