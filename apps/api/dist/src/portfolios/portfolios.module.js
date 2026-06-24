"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfoliosModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const portfolios_service_1 = require("./portfolios.service");
const portfolio_ingest_service_1 = require("./portfolio-ingest.service");
const portfolio_ingest_job_service_1 = require("./portfolio-ingest-job.service");
const portfolio_ingest_producer_1 = require("./portfolio-ingest.producer");
const portfolio_ingest_processor_1 = require("./portfolio-ingest.processor");
const portfolios_controller_1 = require("./portfolios.controller");
const portfolio_ingest_constants_1 = require("./portfolio-ingest.constants");
let PortfoliosModule = class PortfoliosModule {
};
exports.PortfoliosModule = PortfoliosModule;
exports.PortfoliosModule = PortfoliosModule = __decorate([
    (0, common_1.Module)({
        imports: [bullmq_1.BullModule.registerQueue({ name: portfolio_ingest_constants_1.PORTFOLIO_INGEST_QUEUE })],
        controllers: [portfolios_controller_1.PortfoliosController],
        providers: [
            portfolios_service_1.PortfoliosService,
            portfolio_ingest_service_1.PortfolioIngestService,
            portfolio_ingest_job_service_1.PortfolioIngestJobService,
            portfolio_ingest_producer_1.PortfolioIngestProducer,
            portfolio_ingest_processor_1.PortfolioIngestProcessor,
        ],
        exports: [portfolios_service_1.PortfoliosService, portfolio_ingest_service_1.PortfolioIngestService],
    })
], PortfoliosModule);
//# sourceMappingURL=portfolios.module.js.map