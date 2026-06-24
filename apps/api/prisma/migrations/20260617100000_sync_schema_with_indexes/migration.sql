-- Synchronize the database schema with schema.prisma (accumulated drift).
-- The initial migration predated: (1) the addition of password_hash on users
-- (required by AuthService for bcrypt validation), and (2) the performance
-- indexes on tenant-scoped foreign keys and status fields. This migration
-- brings a fresh 'migrate deploy' (CI + new installs) to full schema parity.
-- Note: dev databases previously kept in sync via 'prisma db push' already
-- contain these objects; mark this migration applied there with
-- 'prisma migrate resolve --applied 20260617100000_sync_schema_with_indexes'.

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_hash" TEXT;

-- CreateIndex
CREATE INDEX "agreements_case_id_idx" ON "agreements"("case_id");

-- CreateIndex
CREATE INDEX "agreements_institution_id_idx" ON "agreements"("institution_id");

-- CreateIndex
CREATE INDEX "cases_institution_id_idx" ON "cases"("institution_id");

-- CreateIndex
CREATE INDEX "cases_portfolio_id_idx" ON "cases"("portfolio_id");

-- CreateIndex
CREATE INDEX "cases_debtor_id_idx" ON "cases"("debtor_id");

-- CreateIndex
CREATE INDEX "cases_case_number_idx" ON "cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_status_idx" ON "cases"("status");

-- CreateIndex
CREATE INDEX "communications_case_id_idx" ON "communications"("case_id");

-- CreateIndex
CREATE INDEX "communications_status_idx" ON "communications"("status");

-- CreateIndex
CREATE INDEX "contacts_debtor_id_idx" ON "contacts"("debtor_id");

-- CreateIndex
CREATE INDEX "contacts_value_idx" ON "contacts"("value");

-- CreateIndex
CREATE INDEX "data_passports_case_id_idx" ON "data_passports"("case_id");

-- CreateIndex
CREATE INDEX "data_passports_entity_id_idx" ON "data_passports"("entity_id");

-- CreateIndex
CREATE INDEX "disputes_case_id_idx" ON "disputes"("case_id");

-- CreateIndex
CREATE INDEX "documents_case_id_idx" ON "documents"("case_id");

-- CreateIndex
CREATE INDEX "institutions_status_idx" ON "institutions"("status");

-- CreateIndex
CREATE INDEX "payments_case_id_idx" ON "payments"("case_id");

-- CreateIndex
CREATE INDEX "payments_institution_id_idx" ON "payments"("institution_id");

-- CreateIndex
CREATE INDEX "portfolios_institution_id_idx" ON "portfolios"("institution_id");

-- CreateIndex
CREATE INDEX "portfolios_status_idx" ON "portfolios"("status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_institution_id_idx" ON "users"("institution_id");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

