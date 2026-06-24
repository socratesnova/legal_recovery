"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
beforeAll(async () => {
    await prisma.$connect();
});
afterAll(async () => {
    await prisma.$disconnect();
});
beforeEach(async () => {
    const tables = [
        "audit_logs",
        "communications",
        "payments",
        "promises",
        "agreements",
        "data_passports",
        "documents",
        "disputes",
        "case_products",
        "cases",
        "contacts",
        "consents",
        "data_restrictions",
        "portfolio_ingest_jobs",
        "portfolio_rules",
        "portfolios",
        "institution_contracts",
        "users",
        "institutions",
        "debtors",
    ];
    for (const table of tables) {
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
        }
        catch {
        }
    }
});
//# sourceMappingURL=setup.js.map