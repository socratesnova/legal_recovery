import { Global, Module } from "@nestjs/common";
import { PortfolioRulesService } from "./portfolio-rules.service";

/**
 * Global provider of institution/portfolio rule evaluation. Exposed globally
 * (like PrismaModule / LegalFirewallService) so Agreements, Payments and the
 * Portfolios controller can inject {@link PortfolioRulesService} without a
 * per-module import graph (avoids coupling those modules to PortfoliosModule
 * and its BullMQ ingest machinery).
 */
@Global()
@Module({
  providers: [PortfolioRulesService],
  exports: [PortfolioRulesService],
})
export class RulesModule {}
