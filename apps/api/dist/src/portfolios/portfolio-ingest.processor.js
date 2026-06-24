"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PortfolioIngestProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioIngestProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../common/prisma.service");
const storage_service_1 = require("../common/services/storage.service");
const portfolio_ingest_service_1 = require("./portfolio-ingest.service");
const portfolio_ingest_job_service_1 = require("./portfolio-ingest-job.service");
const portfolio_ingest_constants_1 = require("./portfolio-ingest.constants");
let PortfolioIngestProcessor = PortfolioIngestProcessor_1 = class PortfolioIngestProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, storage, ingest, jobs) {
        super();
        this.prisma = prisma;
        this.storage = storage;
        this.ingest = ingest;
        this.jobs = jobs;
        this.logger = new common_1.Logger(PortfolioIngestProcessor_1.name);
    }
    async process(job, _token) {
        const data = job.data;
        this.logger.log(`Processing ingest job ${data.jobId} for portfolio ${data.portfolioId}`);
        await this.jobs.markRunning(data.jobId);
        try {
            const buffer = await this.storage.get(data.storageKey);
            const rows = await this.ingest.parse(buffer, data.fileName);
            const portfolio = {
                id: data.portfolioId,
                institutionId: data.institutionId,
            };
            const summary = {
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
        }
        catch (err) {
            this.logger.error(`Ingest job ${data.jobId} failed: ${err?.message ?? err}`);
            await this.jobs.markFailed(data.jobId, err);
            throw err;
        }
    }
    async audit(data, summary) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    institutionId: data.institutionId,
                    action: client_1.AuditAction.CREATE,
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
                    },
                    userAgent: "portfolio-ingest-worker",
                },
            });
        }
        catch (err) {
            this.logger.error(`Audit log for ingest job ${data.jobId} failed: ${err?.message ?? err}`);
        }
    }
};
exports.PortfolioIngestProcessor = PortfolioIngestProcessor;
exports.PortfolioIngestProcessor = PortfolioIngestProcessor = PortfolioIngestProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)(portfolio_ingest_constants_1.PORTFOLIO_INGEST_QUEUE),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        portfolio_ingest_service_1.PortfolioIngestService,
        portfolio_ingest_job_service_1.PortfolioIngestJobService])
], PortfolioIngestProcessor);
//# sourceMappingURL=portfolio-ingest.processor.js.map