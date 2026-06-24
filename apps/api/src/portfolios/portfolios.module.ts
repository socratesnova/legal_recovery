import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { PortfoliosService } from "./portfolios.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioIngestProducer } from "./portfolio-ingest.producer";
import { PortfolioIngestProcessor } from "./portfolio-ingest.processor";
import { PortfoliosController } from "./portfolios.controller";
import { PORTFOLIO_INGEST_QUEUE } from "./portfolio-ingest.constants";

@Module({
  imports: [BullModule.registerQueue({ name: PORTFOLIO_INGEST_QUEUE })],
  controllers: [PortfoliosController],
  providers: [
    PortfoliosService,
    PortfolioIngestService,
    PortfolioIngestJobService,
    PortfolioIngestProducer,
    PortfolioIngestProcessor,
  ],
  exports: [PortfoliosService, PortfolioIngestService],
})
export class PortfoliosModule {}
