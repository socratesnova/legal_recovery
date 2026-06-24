import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Full reset of tenant data before each test so suites are hermetic.
  // Truncate child tables first; CASCADE propagates to any dependents we
  // may have missed. RESTART IDENTITY resets sequences/serials.
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
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
    } catch {
      // Ignore tables that may not exist yet or are protected.
    }
  }
});
