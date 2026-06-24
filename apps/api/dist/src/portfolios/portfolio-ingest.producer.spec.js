"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const portfolio_ingest_producer_1 = require("./portfolio-ingest.producer");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const admin = {
    userId: "u1",
    email: "a@b.c",
    role: current_user_decorator_1.UserRole.ADMIN,
    institutionId: "inst1",
};
const file = {
    originalname: "big.csv",
    buffer: Buffer.from("cedula;nombres;apellidos;saldo\n001;Juan;P;100"),
    mimetype: "text/csv",
    size: 40,
};
describe("PortfolioIngestProducer", () => {
    let queue;
    let storage;
    let ingest;
    let jobs;
    let producer;
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
        producer = new portfolio_ingest_producer_1.PortfolioIngestProducer(queue, storage, ingest, jobs);
    });
    it("asserts tenant, stores, creates a PENDING job and enqueues", async () => {
        const res = await producer.enqueue(file, "p1", admin);
        expect(ingest.assertPortfolioInTenant).toHaveBeenCalledWith("p1", admin);
        expect(storage.put).toHaveBeenCalledWith("portfolios/p1/x/big.csv", file.buffer, "text/csv");
        expect(jobs.createPending).toHaveBeenCalledWith(expect.objectContaining({
            portfolioId: "p1",
            institutionId: "inst1",
            storageKey: "portfolios/p1/x/big.csv",
            fileName: "big.csv",
            startedBy: "u1",
        }));
        expect(queue.add).toHaveBeenCalledWith("ingest", expect.objectContaining({
            jobId: "job-1",
            storageKey: "portfolios/p1/x/big.csv",
            portfolioId: "p1",
            institutionId: "inst1",
            userId: "u1",
        }), expect.objectContaining({ attempts: 1 }));
        expect(res).toEqual({
            jobId: "job-1",
            status: "PENDING",
            portfolioId: "p1",
        });
    });
    it("propagates 404 when the portfolio does not exist (before storing)", async () => {
        ingest.assertPortfolioInTenant.mockRejectedValue(new common_1.NotFoundException("Portfolio not found"));
        await expect(producer.enqueue(file, "p1", admin)).rejects.toBeInstanceOf(common_1.NotFoundException);
        expect(storage.put).not.toHaveBeenCalled();
        expect(jobs.createPending).not.toHaveBeenCalled();
        expect(queue.add).not.toHaveBeenCalled();
    });
    it("propagates 403 when the portfolio belongs to another tenant", async () => {
        ingest.assertPortfolioInTenant.mockRejectedValue(new common_1.ForbiddenException("Portfolio does not belong to your institution"));
        await expect(producer.enqueue(file, "p1", admin)).rejects.toBeInstanceOf(common_1.ForbiddenException);
        expect(storage.put).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=portfolio-ingest.producer.spec.js.map