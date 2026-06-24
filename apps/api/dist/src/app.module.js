"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bullmq_1 = require("@nestjs/bullmq");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const institutions_module_1 = require("./institutions/institutions.module");
const portfolios_module_1 = require("./portfolios/portfolios.module");
const cases_module_1 = require("./cases/cases.module");
const documents_module_1 = require("./documents/documents.module");
const data_passports_module_1 = require("./data-passports/data-passports.module");
const contacts_module_1 = require("./contacts/contacts.module");
const consents_module_1 = require("./consents/consents.module");
const scores_module_1 = require("./scores/scores.module");
const agreements_module_1 = require("./agreements/agreements.module");
const payments_module_1 = require("./payments/payments.module");
const disputes_module_1 = require("./disputes/disputes.module");
const communications_module_1 = require("./communications/communications.module");
const reports_module_1 = require("./reports/reports.module");
const audit_module_1 = require("./audit/audit.module");
const rules_module_1 = require("./rules/rules.module");
const prisma_module_1 = require("./common/prisma.module");
const storage_module_1 = require("./common/storage.module");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
const decimal_serialize_interceptor_1 = require("./common/interceptors/decimal-serialize.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [".env", ".env.local", ".env.development"],
            }),
            prisma_module_1.PrismaModule,
            rules_module_1.RulesModule,
            storage_module_1.StorageModule,
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || "localhost",
                    port: parseInt(process.env.REDIS_PORT || "6379"),
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            institutions_module_1.InstitutionsModule,
            portfolios_module_1.PortfoliosModule,
            cases_module_1.CasesModule,
            documents_module_1.DocumentsModule,
            data_passports_module_1.DataPassportsModule,
            contacts_module_1.ContactsModule,
            consents_module_1.ConsentsModule,
            agreements_module_1.AgreementsModule,
            payments_module_1.PaymentsModule,
            disputes_module_1.DisputesModule,
            communications_module_1.CommunicationsModule,
            reports_module_1.ReportsModule,
            audit_module_1.AuditModule,
            scores_module_1.ScoresModule,
        ],
        providers: [audit_interceptor_1.AuditInterceptor, decimal_serialize_interceptor_1.DecimalSerializeInterceptor],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map