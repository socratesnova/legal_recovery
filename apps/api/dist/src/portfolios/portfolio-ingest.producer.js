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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PortfolioIngestProducer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioIngestProducer = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const storage_service_1 = require("../common/services/storage.service");
const portfolio_ingest_service_1 = require("./portfolio-ingest.service");
const portfolio_ingest_job_service_1 = require("./portfolio-ingest-job.service");
const portfolio_ingest_constants_1 = require("./portfolio-ingest.constants");
let PortfolioIngestProducer = PortfolioIngestProducer_1 = class PortfolioIngestProducer {
    constructor(queue, storage, ingest, jobs) {
        this.queue = queue;
        this.storage = storage;
        this.ingest = ingest;
        this.jobs = jobs;
        this.logger = new common_1.Logger(PortfolioIngestProducer_1.name);
    }
    async enqueue(file, portfolioId, user) {
        const portfolio = await this.ingest.assertPortfolioInTenant(portfolioId, user);
        const storageKey = this.storage.buildKey(`portfolios/${portfolio.id}`, file.originalname);
        await this.storage.put(storageKey, file.buffer, file.mimetype);
        const job = await this.jobs.createPending({
            portfolioId: portfolio.id,
            institutionId: portfolio.institutionId,
            storageKey,
            fileName: file.originalname,
            mimeType: file.mimetype,
            startedBy: user.userId,
        });
        const payload = {
            jobId: job.id,
            storageKey,
            portfolioId: portfolio.id,
            institutionId: portfolio.institutionId,
            userId: user.userId,
            fileName: file.originalname,
            mimeType: file.mimetype,
        };
        await this.queue.add(portfolio_ingest_constants_1.PORTFOLIO_INGEST_JOB_NAME, payload, {
            attempts: 1,
            removeOnComplete: false,
            removeOnFail: false,
        });
        this.logger.log(`Enqueued async ingest job ${job.id} for portfolio ${portfolio.id} (${file.originalname})`);
        return { jobId: job.id, status: job.status, portfolioId: portfolio.id };
    }
};
exports.PortfolioIngestProducer = PortfolioIngestProducer;
exports.PortfolioIngestProducer = PortfolioIngestProducer = PortfolioIngestProducer_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(portfolio_ingest_constants_1.PORTFOLIO_INGEST_QUEUE)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        storage_service_1.StorageService,
        portfolio_ingest_service_1.PortfolioIngestService,
        portfolio_ingest_job_service_1.PortfolioIngestJobService])
], PortfolioIngestProducer);
//# sourceMappingURL=portfolio-ingest.producer.js.map