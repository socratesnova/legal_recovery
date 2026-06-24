-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('BANK', 'FUND', 'COOPERATIVE', 'FINANCIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'RESTRICTED', 'BLOCKED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PortfolioType" AS ENUM ('ASSIGNED', 'CEDED', 'PURCHASED', 'MANDATE', 'JUDICIAL');

-- CreateEnum
CREATE TYPE "PortfolioStatus" AS ENUM ('ACTIVE', 'PROCESSING', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('ACTIVE', 'RESTRICTED', 'BLOCKED', 'DISPUTED', 'CLOSED', 'JUDICIAL');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('PHONE', 'EMAIL', 'WHATSAPP', 'ADDRESS');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('COMMUNICATION', 'DATA_PROCESSING', 'WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "CommChannel" AS ENUM ('EMAIL', 'SMS', 'PHONE', 'WHATSAPP', 'PORTAL', 'LETTER', 'VOICEBOT');

-- CreateEnum
CREATE TYPE "CommDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "CommStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AgreementType" AS ENUM ('SETTLEMENT', 'INSTALLMENTS', 'FULL_PAYMENT', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PromiseStatus" AS ENUM ('PENDING', 'FULFILLED', 'BROKEN', 'EXTENDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'TRANSFER', 'DEPOSIT', 'CASH', 'GATEWAY', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'RECONCILED', 'REJECTED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'GESTOR', 'ABOGADO', 'COMPLIANCE', 'BANCO', 'DEUDOR');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'DOWNLOAD', 'CONTACT', 'EXPORT', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "PassportStatus" AS ENUM ('ACTIVE', 'RESTRICTED', 'BLOCKED', 'EXPIRED', 'PENDING');

-- CreateTable
CREATE TABLE "institutions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL,
    "tax_id" TEXT,
    "country" TEXT NOT NULL DEFAULT 'DO',
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "max_discount_auto" DECIMAL(5,2),
    "max_discount_manual" DECIMAL(5,2),
    "min_installments" INTEGER,
    "max_installments" INTEGER,
    "auto_approval_limit" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_contracts" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "contract_type" TEXT NOT NULL,
    "discount_rules" JSONB,
    "commission_rules" JSONB,
    "sla" TEXT,
    "required_documents" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PortfolioType" NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DOP',
    "file_source" TEXT,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PortfolioStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_rules" (
    "id" UUID NOT NULL,
    "portfolio_id" UUID NOT NULL,
    "discount_max" DECIMAL(5,2),
    "min_installments" INTEGER,
    "max_installments" INTEGER,
    "auto_approval_limit" DECIMAL(15,2),
    "channels_allowed" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debtors" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "id_type" TEXT NOT NULL DEFAULT 'cedula',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "debtors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "portfolio_id" UUID NOT NULL,
    "debtor_id" UUID NOT NULL,
    "case_number" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "total_balance" DECIMAL(15,2) NOT NULL,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "next_action" TEXT,
    "next_action_date" TIMESTAMP(3),
    "score_documental" INTEGER,
    "score_recoverability" INTEGER,
    "score_contactability" INTEGER,
    "score_risk" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_products" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "product_type" TEXT NOT NULL,
    "original_amount" DECIMAL(15,2) NOT NULL,
    "current_balance" DECIMAL(15,2) NOT NULL,
    "interest_rate" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_hash" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "debtor_id" UUID NOT NULL,
    "channel" "ContactChannel" NOT NULL,
    "value" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "opt_in" BOOLEAN NOT NULL DEFAULT false,
    "opt_in_date" TIMESTAMP(3),
    "data_passport_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" UUID NOT NULL,
    "debtor_id" UUID NOT NULL,
    "type" "ConsentType" NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "granted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "contact_id" UUID,
    "user_id" UUID,
    "channel" "CommChannel" NOT NULL,
    "direction" "CommDirection" NOT NULL DEFAULT 'OUTBOUND',
    "content_summary" TEXT,
    "status" "CommStatus" NOT NULL DEFAULT 'PENDING',
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "block_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "type" "AgreementType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "discount_percentage" DECIMAL(5,2),
    "installments" INTEGER,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promises" (
    "id" UUID NOT NULL,
    "agreement_id" UUID NOT NULL,
    "promised_date" TIMESTAMP(3) NOT NULL,
    "promised_amount" DECIMAL(15,2) NOT NULL,
    "status" "PromiseStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "agreement_id" UUID,
    "institution_id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "receipt_path" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reconciled_at" TIMESTAMP(3),
    "reconciled_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "opened_by" UUID NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_by" UUID,
    "resolved_at" TIMESTAMP(3),
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "keycloak_id" TEXT,
    "institution_id" UUID,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "institution_id" UUID,
    "action" "AuditAction" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "changes_json" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_passports" (
    "id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "field_name" TEXT NOT NULL,
    "field_value_hash" TEXT,
    "source_type" TEXT NOT NULL,
    "source_reference" TEXT,
    "legal_basis" TEXT NOT NULL,
    "allowed_uses" TEXT[],
    "prohibited_uses" TEXT[],
    "confidence_score" INTEGER,
    "visibility_roles" TEXT[],
    "status" "PassportStatus" NOT NULL DEFAULT 'ACTIVE',
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_validated_at" TIMESTAMP(3),
    "expiration_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_passports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_restrictions" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "field_name" TEXT NOT NULL,
    "restriction_type" TEXT NOT NULL,
    "reason" TEXT,
    "applied_by" UUID NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_rules_portfolio_id_key" ON "portfolio_rules"("portfolio_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_keycloak_id_key" ON "users"("keycloak_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "institution_contracts" ADD CONSTRAINT "institution_contracts_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_rules" ADD CONSTRAINT "portfolio_rules_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "debtors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_products" ADD CONSTRAINT "case_products_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_debtor_id_fkey" FOREIGN KEY ("debtor_id") REFERENCES "debtors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promises" ADD CONSTRAINT "promises_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_passports" ADD CONSTRAINT "data_passports_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
