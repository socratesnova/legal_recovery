# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager and environment

- **Package manager:** `pnpm` (v10). Do not use `npm` or `yarn` for monorepo operations. Note: the Dockerfiles in `apps/api/Dockerfile` and `apps/web/Dockerfile` currently use `npm`, which is a known inconsistency.
- **Node:** 20+ expected.
- **Monorepo tool:** Turborepo (`turbo.json` at root). Workspaces: `apps/*`, `packages/*` (see `pnpm-workspace.yaml`).

## Common commands

Run from the repository root unless noted.

```bash
# Install dependencies
pnpm install

# Development (both apps in parallel via turbo)
pnpm dev

# Verification order (matches CI)
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Integration / E2E tasks are defined in turbo.json and CI, but the Jest configs
# under apps/api/test do not exist yet; do not expect them to pass out-of-the-box.
pnpm test:integration
pnpm test:e2e

# Database (Prisma is inside apps/api)
pnpm db:generate       # regenerate Prisma Client
pnpm db:migrate        # create/apply dev migrations
pnpm db:seed           # run apps/api/scripts/seed.ts
pnpm db:studio         # open Prisma Studio

# Per-app dev shortcuts
cd apps/api && pnpm start:dev     # NestJS watch mode, port 3002 by default
cd apps/api && pnpm test:watch    # Jest watch mode
cd apps/api && pnpm test:cov      # Jest with coverage
cd apps/web && pnpm dev           # Next.js dev server, port 3000
```

### Running a single test

```bash
cd apps/api
npx jest --testPathPattern=auth.service
# or
npx jest src/auth/auth.service.spec.ts
```

### Local infrastructure (Docker)

```bash
# PostgreSQL 16, Redis 7, MinIO, API, Web
docker-compose up
```

- Web: http://localhost:3000
- API: http://localhost:3001 (Docker sets `PORT=3001`; local `pnpm start:dev` defaults to 3002)
- Swagger: http://localhost:3001/api/docs
- MinIO Console: http://localhost:9001

## Canonical sources of truth

`AGENTS.md` is the primary companion document. Read it first for:
- Product vision, backlog, acceptance criteria, and the 23 module-specific prompts.
- The 8 critical business rules (data provenance, no unauthorized contact, WhatsApp restrictions, external data restrictions, human-in-the-loop, immutable audit logs, RBAC/ABAC, no equal spending).
- Deployment details for the Proxmox/K3s environment.

`apps/web/AGENTS.md` carries Next.js-specific agent rules.

## Monorepo structure

| Path | Purpose |
|------|---------|
| `apps/api` | NestJS backend API |
| `apps/web` | Next.js 15.5.18 frontend (App Router) |
| `packages/shared-types` | Shared TypeScript types / Zod schemas (minimal scaffold, `src/index.ts`) |
| `poc/` | **Old standalone proof-of-concept.** Do not edit. The active web app is `apps/web`. |

**Note:** `apps/web/package.json` package name is `legal-recovery-web` (renamed from the old `poc` leftover). Use the workspace path `apps/web`.

## Backend architecture (`apps/api`)

- **Framework:** NestJS 11, modular architecture (controllers, services, guards, pipes).
- **ORM:** Prisma 6. The schema at `apps/api/prisma/schema.prisma` is the single source of truth.
- **API style:** REST with URI versioning (`/api/v1/...`). Swagger docs served at `/api/docs`.
- **Global middleware:** Helmet, compression, CORS, `ValidationPipe` (whitelist + forbidNonWhitelisted), `AuditInterceptor`, `HttpExceptionFilter`.
- **Queueing:** BullMQ + Redis configured in `AppModule` but not actively used by wired modules yet.

### Active vs. stubbed modules

Wired in `apps/api/src/app.module.ts`:
`AuthModule`, `UsersModule`, `InstitutionsModule`, `PortfoliosModule` (with `PortfolioIngestService`), `CasesModule`, `DocumentsModule` (real S3 upload/download), `DataPassportsModule`, `ContactsModule`, `ConsentsModule`, `AgreementsModule`, `PaymentsModule`, `DisputesModule`, `CommunicationsModule` (Legal Firewall-gated, real dispatch via `NotificationDispatcher`), `ReportsModule`, `AuditModule`.

Global infra modules: `ConfigModule`, `PrismaModule` (exports `PrismaService` + `LegalFirewallService`), `StorageModule` (exports `StorageService`), `ThrottlerModule`, `BullModule`.

Still **commented out** in `app.module.ts` (models exist in Prisma, NestJS modules not yet built):
`Scores`, `AI`.

When enabling or adding a module, import it in `AppModule` and add its Swagger tag in `apps/api/src/main.ts`.

### Object storage & portfolio ingest (backend)

- `StorageService` (`apps/api/src/common/services/storage.service.ts`) is a **global** provider (via `StorageModule`) wrapping `@aws-sdk/client-s3` + `s3-request-presigner`, configured from `MINIO_*` env vars. It does `put`/`get`/`delete` and presigned download URLs, with best-effort bucket creation at init (never blocks startup). `buildKey` produces tenant/case-scoped keys and `sha256` is computed per upload for integrity.
- `DocumentsService.upload()` streams an uploaded file to object storage via `FileInterceptor`, stores the object key as `filePath` with the SHA-256 hash, and `getDownloadUrl()` issues short-lived presigned URLs. Both are tenant-scoped.
- `PortfolioIngestService.ingest()` parses CSV (`csv-parse/sync`) or XLSX (`exceljs`), normalizes ES/EN headers, dedupes debtors by `idNumber` (find-or-create), creates `Case` (+ `CaseProduct` when product data is present), and recomputes `portfolio.totalAmount`. Synchronous, capped at 10 000 rows (`MAX_ROWS`); larger files need the async BullMQ pipeline (TODO).

### Legal Firewall service (backend)

`LegalFirewallService` (`apps/api/src/common/services/legal-firewall.service.ts`) is a **global provider** exported from `PrismaModule`. It implements `canUseData(actor, { caseId, purpose, channel?, entityType?, entityId?, fieldName? })` and `assertCanUse(...)` (throws 403 on denial), resolving the rules against real Prisma data (Case status, Disputes, DataPassport provenance/visibility/expiration, DataRestriction, Contact opt-ins, Consent grants/revocations). It mirrors the frontend rules in `apps/web/src/lib/legal-firewall.ts`. Every sensitive action (contact, view, download, export) MUST route through it. Unit-tested in `legal-firewall.service.spec.ts`.

### Communications dispatch (backend)

`CommunicationsService.create()` runs the Legal Firewall first; a blocked attempt is still persisted with `status=BLOCKED` + `blockReason` (for the audit trail) and no message is sent. When allowed, the communication is created `PENDING`, then dispatched through `NotificationDispatcher` (`apps/api/src/communications/notification-dispatcher.ts`) and updated to its final state:

- **EMAIL** → nodemailer/SMTP; **SMS/WhatsApp** → Twilio REST API via `fetch` (the `twilio` package is kept for future webhook-signature validation). WhatsApp is additionally gated by `WHATSAPP_ENABLED=true` (the firewall already enforces opt-in).
- **SIMULATED mode**: when a provider's credentials are absent (`SMTP_HOST`, `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_*_FROM`), the dispatch returns `status=SENT, simulated=true` with a `simulated-<uuid>` message id — so the full contact flow works in dev with zero external services.
- **Manual channels** (`PHONE`, `LETTER`, `PORTAL`, `VOICEBOT`) are recorded, not auto-dispatched (`status=SENT, simulated=true`, no provider id).
- Provider channels (`EMAIL`/`SMS`/`WHATSAPP`) resolve a destination from the case's debtor contacts (explicit `contactId` or the primary opt-in contact of the mapped channel); no destination on file → `status=FAILED`. Dispatch never throws — provider failures become `status=FAILED` with an error string.

The `Communication` model carries `providerMessageId` and `simulated` for traceability (migration `20260617000000_add_comm_dispatch_fields`). Inbound delivery webhooks (DELIVERED/READ reconciliation) and BullMQ-based retry/async dispatch are future work (TODO). Unit-tested in `communications.service.spec.ts` + `notification-dispatcher.spec.ts`.

### Auth state

Current auth is JWT-based. `AuthService.validateUser` verifies the password hash with bcrypt and returns the user without `passwordHash`. The JWT payload carries `sub`, `email`, `role`, and `institutionId`. Migration to Keycloak is planned; `keycloak-connect` is already a dependency.

### Database model highlights

- PostgreSQL 16. UUID primary keys. Soft deletes via `deleted_at`.
- Multi-tenant: shared schema with `institution_id` on all tenant-scoped entities.
- `Debtor` is the exception: it has **no** `institution_id` — a debtor is global (one row per national id, shared across institutions); tenant isolation is enforced via the institution-scoped `Case`. `Debtor.idNumber` is `@unique` (migration `20260617090000_add_debtor_id_number_unique`), and `PortfolioIngestService` handles the resulting `P2002` race by re-fetching and reusing the existing row.
- Core entities: `Institution`, `InstitutionContract`, `Portfolio`, `PortfolioRule`, `Debtor`, `Case`, `CaseProduct`, `Document`, `Contact`, `Consent`, `Communication`, `Agreement`, `Promise`, `Payment`, `Dispute`, `User`, `AuditLog`, `DataPassport`, `DataRestriction`.
- Enums are defined in Prisma (e.g., `UserRole`, `CaseStatus`, `ContactChannel`, `AgreementType`, `AuditAction`, `PassportStatus`).

## Frontend architecture (`apps/web`)

- **Framework:** Next.js 15.5.18 (pinned to 15.5.x to close middleware/proxy CVEs; 16.x had a critical `workStore` build error), React 19, Tailwind CSS v4, shadcn/ui.
- **Build output:** `output: "standalone"` only on non-Windows (`next.config.ts` toggles it by platform to avoid EPERM symlink errors during standalone tracing on Windows).
- **Theme:** Dark UI with slate/emerald palette.
- **Portals:** Three distinct portal layouts under `/portal`:
  - `/portal/admin` — Legal office (super_admin, gestor, etc.)
  - `/portal/bank` — Bank/fund institution portal
  - `/portal/debtor` — Self-service debtor portal

### Auth and data on the frontend

The frontend currently runs on **static demo data** (`apps/web/src/lib/seed-data.ts`).
- `demoUsers` (2 users), `demoCases` (3 cases), `demoCommunications`, `demoKPIs`, `demoAuditLog`.
- Demo auth uses `jose` (HS256) with a hardcoded secret in `apps/web/src/lib/demo-auth.ts`. Token and user object are stored in `localStorage`.
- The `canUseData` / `checkFirewall` functions in `apps/web/src/lib/legal-firewall.ts` implement the Legal Firewall rules against static demo cases.

### Frontend build quirks

- `next.config.ts` disables ESLint during builds (`ignoreDuringBuilds: true`) and uses unoptimized images.
- `apps/web/AGENTS.md` contains Next.js-specific agent rules; read it before writing frontend code.

## Legal Firewall and Data Passport

These are the central compliance concepts of the product:

- **Data Passport:** Every sensitive data field carries provenance metadata: `sourceType`, `legalBasis`, `allowedUses`, `prohibitedUses`, `confidenceScore`, `expirationDate`, and `visibilityRoles`.
- **Legal Firewall:** Before any contact or data access, the system checks `canUseData(user, data, purpose, channel)`. It blocks:
  - Data without legal/contractual source.
  - Contact to unauthorized third parties.
  - WhatsApp without explicit opt-in.
  - Communications on cases with `disputed` or `blocked` status.
  - Expired or restricted data.

On the backend, `DataPassport` and `DataRestriction` Prisma models exist. On the frontend, the rules are enforced in `apps/web/src/lib/legal-firewall.ts`.

## CI/CD

`.github/workflows/ci-cd.yml`:
1. `lint-and-typecheck` on every PR/push.
2. `test-unit` (needs `lint-and-typecheck`).
3. `test-integration` (spins up PostgreSQL 16 and Redis 7 services, runs Prisma migrate deploy, then integration tests).
4. `build-and-push` (Docker images to GHCR) only on `main`/`master` after tests pass.

`.github/workflows/deploy.yml` handles deployment to the Proxmox/K3s environment.

## Important state notes

- `packages/shared-types` has a `package.json` and a minimal `src/index.ts` placeholder; expand when sharing types between apps.
- The `poc/` directory is the old standalone demo and should be ignored for new work.
- Core read/write flows are implemented and tenant-scoped: auth (bcrypt), users, institutions, portfolios (+ CSV/XLSX ingest), cases, documents (real S3 upload/download), data-passports, contacts, consents, disputes, communications (Legal Firewall-gated), agreements, payments, reports, audit. Some `ReportsModule` aggregations remain lightweight.
- **Debtor dedupe is global by `idNumber`** (no `institutionId` on `Debtor`). Access is governed by the tenant-scoped `Case`, not the `Debtor` row. Adding `@unique` on `idNumber` + RLS is a hardening TODO.
- The frontend uses `localStorage` for demo auth tokens; this is not production-grade.
- Dockerfiles currently use `npm` instead of `pnpm`; this is a known inconsistency.
- `turbo.json` declares `globalDependencies: [".env"]`. Keep `.env` present or turbo will re-run tasks unnecessarily.
- `pnpm-workspace.yaml` declares `onlyBuiltDependencies: [bcrypt]` (pnpm 10 no longer reads this from `package.json`).
- Dependency CVE status: `pnpm audit --prod` reports 0 high (down from 14). Residual 3 moderate + 1 low are transitive and non-exploitable in our flow: `postcss` (via next, forcing it risks the build), `uuid@8` (via exceljs, v3/v5/v6 buffer check only — we use v4), `js-yaml@4.1.1` (via @nestjs/swagger; only generates YAML, never parses untrusted), `elliptic` (via keycloak-connect, no upstream patch).
