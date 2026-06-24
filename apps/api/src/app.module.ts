import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { BullModule } from "@nestjs/bullmq";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { InstitutionsModule } from "./institutions/institutions.module";
import { PortfoliosModule } from "./portfolios/portfolios.module";
import { CasesModule } from "./cases/cases.module";
import { DocumentsModule } from "./documents/documents.module";
import { DataPassportsModule } from "./data-passports/data-passports.module";
import { ContactsModule } from "./contacts/contacts.module";
import { ConsentsModule } from "./consents/consents.module";
import { ScoresModule } from "./scores/scores.module";
import { AgreementsModule } from "./agreements/agreements.module";
import { PaymentsModule } from "./payments/payments.module";
import { DisputesModule } from "./disputes/disputes.module";
import { CommunicationsModule } from "./communications/communications.module";
import { ReportsModule } from "./reports/reports.module";
import { AuditModule } from "./audit/audit.module";
import { RulesModule } from "./rules/rules.module";
// import { AiModule } from './ai/ai.module';

import { PrismaModule } from "./common/prisma.module";
import { StorageModule } from "./common/storage.module";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";
import { DecimalSerializeInterceptor } from "./common/interceptors/decimal-serialize.interceptor";

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local", ".env.development"],
    }),

    // Prisma (global)
    PrismaModule,

    // Institution/portfolio rule evaluation (global) — consumed by Agreements,
    // Payments and the Portfolios controller.
    RulesModule,

    // Object storage (MinIO/S3) — global, used by documents & portfolio uploads
    StorageModule,

    // Rate Limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),

    // BullMQ / Redis
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    InstitutionsModule,
    PortfoliosModule,
    CasesModule,
    DocumentsModule,
    DataPassportsModule,
    ContactsModule,
    ConsentsModule,
    AgreementsModule,
    PaymentsModule,
    DisputesModule,
    CommunicationsModule,
    ReportsModule,
    AuditModule,
    ScoresModule,
    // AiModule,
  ],
  // AuditInterceptor is resolved via app.get(AuditInterceptor) in main.ts so it
  // must be a DI provider here. Its PrismaService dependency is @Global.
  providers: [AuditInterceptor, DecimalSerializeInterceptor],
})
export class AppModule {}
