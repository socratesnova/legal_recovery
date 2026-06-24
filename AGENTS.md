# AGENTS.md — Legal Recovery OS

## Project state

- **Monorepo with code.** Active code is in `apps/api` (NestJS) and `apps/web` (Next.js 15). The `poc/` directory is the old standalone proof-of-concept — do not edit; it is kept for reference.
- **Workspaces:** `apps/*`, `packages/*`. Package manager: `pnpm@10`. Use `pnpm` for all monorepo operations.
- **Not productionized yet.** Backend auth is JWT-based demo (password hash not validated). Frontend runs on static demo data and stores a demo JWT in `localStorage`.

## Canonical sources of truth

| Need | Read this |
|------|-----------|
| Product vision, backlog, acceptance criteria | `Legal_Recovery_OS_Documento_de_Alcance.md` |
| Stack decisions, cost estimates, monorepo intent | `PLAN_MAESTRO_IMPLEMENTACION.md` |
| Architecture & business rules per module | `Legal_Recovery_OS_Prompts_Desarrollo/*.txt` (23 prompts) |
| Prompt index | `Legal_Recovery_OS_Prompts_Desarrollo/prompts_index.json` |
| Prisma data model | `apps/api/prisma/schema.prisma` |
| Infrastructure / Proxmox VM | `DEPLOY_PROXMOX.md` |
| Frontend-specific Next.js guidance | `apps/web/AGENTS.md` |

**The prompts are the canonical source of truth for code generation.** Read the relevant prompt first; every prompt repeats the 8 critical rules at the top.

## Common commands

Run from the repository root unless noted.

```bash
# Install / reset
pnpm install

# Dev servers (both apps in parallel via turbo)
pnpm dev

# Verification order in CI: lint -> typecheck -> test -> build
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Integration / E2E tasks are defined in turbo.json and CI but currently need
# real test configs to exist under apps/api/test. Do not expect them to pass
# out-of-the-box until those configs are added.
pnpm test:integration
pnpm test:e2e

# Prisma (schema lives in apps/api)
pnpm db:generate      # regenerate Prisma Client
pnpm db:migrate       # create/apply dev migrations
pnpm db:seed          # run apps/api/scripts/seed.ts
pnpm db:studio        # open Prisma Studio

# Per-app dev shortcuts
cd apps/api && pnpm start:dev     # NestJS watch mode
cd apps/api && pnpm test:watch    # Jest watch mode
cd apps/api && npx jest --testPathPattern=auth.service   # single test
cd apps/web && pnpm dev           # Next.js dev server, port 3000
```

### Test reality check

- `apps/api` has a `jest` block in `package.json` for unit tests only.
- `test/jest-integration.json` and `test/jest-e2e.json` referenced in `package.json` **do not exist yet**.
- CI integration job uses inline `DATABASE_URL` and `REDIS_URL` against service containers; local integration tests will fail unless PostgreSQL 16 + Redis are running.

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Next.js 15.3.2 + React 19 + Tailwind CSS v4 + shadcn/ui | App Router, `output: "standalone"`, dark slate/emerald theme |
| Backend | NestJS 11 (TypeScript) | Modular: controllers, services, guards, pipes |
| ORM | Prisma 6 | `apps/api/prisma/schema.prisma` is single source of truth |
| Auth | JWT demo now; Keycloak planned | JWT payload: `sub`, `email`, `role`, `institutionId` |
| Queues | BullMQ + Redis | Wired in `AppModule`, not actively used by modules yet |
| Files | MinIO (S3-compatible) | Presigned URLs via `@aws-sdk/client-s3` |
| AI microservice | FastAPI + LangChain + ChromaDB | **Only Python service.** Internal network only (Phase 2) |
| BI | Metabase | Connects directly to PostgreSQL |
| DB | PostgreSQL 16 | UUID PKs, soft deletes via `deleted_at` |

## Architecture notes

- **Three portals:** `/portal/admin` (legal office), `/portal/bank` (bank/fund), `/portal/debtor` (self-service).
- **Multi-tenant:** shared DB/shared schema with `institution_id` on tenant-scoped entities; RLS policies are intended.
- **Data Passport + Legal Firewall:** every sensitive field carries provenance metadata. `canUseData(user, data, purpose, channel)` must gate contact and data access. Frontend rules live in `apps/web/src/lib/legal-firewall.ts`.
- **Entity states:** `active`, `restricted`, `blocked`, `disputed`, `closed`.
- **API versioning:** REST with URI versioning (`/api/v1/...`). Swagger docs at `/api/docs`.
- **Global middleware:** Helmet, compression, CORS, `ValidationPipe` (whitelist + forbidNonWhitelisted), `AuditInterceptor`, `HttpExceptionFilter`.

### Backend module wiring

Only these modules are currently enabled in `apps/api/src/app.module.ts`:
- `AuthModule`, `UsersModule`, `InstitutionsModule`, `PortfoliosModule`, `CasesModule`, `DocumentsModule`, `AgreementsModule`, `PaymentsModule`, `ReportsModule`.

These exist as controller/service stubs but are **commented out** in `app.module.ts`:
`DataPassports`, `Contacts`, `Consents`, `Scores`, `Disputes`, `Communications`, `Audit`, `AI`.

When adding a new module, import it in `AppModule` **and** add its Swagger tag in `apps/api/src/main.ts`.

### Quirks

- `apps/web/package.json` has `"name": "poc"` — a leftover from migration. Always refer to the package by path `apps/web` in workspace scripts, never by the name `poc`.
- `packages/shared-types` has a `package.json` but no exported source files yet.
- `turbo.json` declares `globalDependencies: [".env"]`. Keep `.env` present or turbo will re-run tasks unnecessarily.
- `apps/web/next.config.ts` disables ESLint during builds (`ignoreDuringBuilds: true`) and uses unoptimized images.
- API Dockerfile runs `prisma migrate deploy && prisma generate` at container start, so a live DB must be reachable before the API starts.

## Local infrastructure

```bash
# PostgreSQL 16, Redis 7, MinIO, API, Web
docker-compose up
```

- API: http://localhost:3001
- Web: http://localhost:3000
- Swagger: http://localhost:3001/api/docs
- MinIO Console: http://localhost:9001

Root `docker-compose.yml` is the primary local stack definition. `infra/docker/docker-compose.yml` is an alternate, more detailed compose with init scripts; prefer the root one for quick local runs.

## CI/CD

- `.github/workflows/ci-cd.yml`: lint/typecheck -> unit tests -> integration tests (PG+Redis services + `prisma migrate deploy`) -> build/push Docker images to GHCR on `main`/`master`.
- `.github/workflows/deploy.yml`: self-hosted K3s runner builds images, applies Kustomize manifests from `kubernetes_proxmox/proyectos/legal-recovery`, and waits for rollouts. Deployment runs only on `main`/`master`.

## Critical business rules — never violate

1. **Data provenance:** every field must carry source, date, legal basis, allowed uses, restrictions, confidence score, audit trail. Block data without a legal/contractual source.
2. **No unauthorized contact:** block communication to unauthorized third parties.
3. **WhatsApp restrictions:** restricted channel — opt-in + policy rules required. Never use for direct mass collection.
4. **External data restrictions:** TSS, JCE, credit bureaus — only via authorized integrations with valid legal basis. No scraping.
5. **Human-in-the-loop:** legally sensitive decisions require human review. AI never auto-decides these.
6. **Immutable audit logs:** every create/update/delete/download/contact action logged immutably.
7. **RBAC/ABAC:** access by role + institution + portfolio + data sensitivity. Multi-tenant isolation mandatory.
8. **No equal spending:** every case needs budget, score, and next best action — do not spend equally on all.

## Testing priorities

Per `21_prompt_testing_qa.txt`, focus first on:
- Legal Firewall blocking (missing source, unauthorized contact, WhatsApp without opt-in, disputed cases, expired/restricted data).
- RBAC/ABAC per institution and portfolio.
- Audit log immutability.
- Portfolio upload validation.
- Debtor portal access boundaries.
