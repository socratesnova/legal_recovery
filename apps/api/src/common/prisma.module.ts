import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { LegalFirewallService } from "./services/legal-firewall.service";

@Global()
@Module({
  providers: [PrismaService, LegalFirewallService],
  exports: [PrismaService, LegalFirewallService],
})
export class PrismaModule {}
