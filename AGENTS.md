# AGENTS.md — Legal Recovery OS

## Repo shape

- Active code is the pnpm/turbo monorepo: `apps/api` (NestJS 11), `apps/web` (Next.js 15.5.18), `packages/shared-types` (minimal placeholder). Ignore `poc/`; it is the old standalone demo.
- Use `pnpm@10` from the repo root. Do not switch to `npm`/`yarn`; Dockerfiles also use pnpm now.
- Root `README.md` is stale (it still points at `poc`). Prefer executable config (`package.json`, `turbo.json`, `pnpm-workspace.yaml`) and this file.

## Product sources that matter

- Scope/backlog/acceptance: `Legal_Recovery_OS_Documento_de_Alcance.md`.
- Module prompts live at repo root (`01_prompt_*.txt` … `22_prompt_*.txt`); `prompts_index.json` is the index. Read the relevant prompt before generating module code.
- Prisma model source of truth: `apps/api/prisma/schema.prisma`.
- Frontend-specific Next.js warning: read `apps/web/AGENTS.md` before editing `apps/web`.

## Commands

```bash
pnpm install
pnpm dev                       # turbo, API + web in parallel
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:integration           # API integration suite; needs local PostgreSQL + Redis
pnpm test:e2e                   # API e2e config exists; web e2e is only a no-op script

pnpm db:generate                # cd apps/api && prisma generate
pnpm db:migrate                 # cd apps/api && prisma migrate dev
pnpm db:seed                    # cd apps/api && ts-node scripts/seed.ts
pnpm db:studio

cd apps/api && pnpm start:dev    # local API defaults to :3002
cd apps/api && pnpm test:watch
cd apps/api && npx jest src/auth/auth.service.spec.ts
cd apps/web && pnpm dev          # web :3000
```

## Test and infra gotchas

- API unit tests are `apps/api/src/**/*.spec.ts` via the Jest block in `apps/api/package.json` (`rootDir: src`).
- API integration tests are under `apps/api/test/integration/*.integration-spec.ts`; `test/setup-env.ts` defaults to `postgresql://legal_recovery:legal_recovery_dev_2024@localhost:5432/legal_recovery_test?schema=public` and `redis://localhost:6379` if env vars are absent.
- `docker-compose.yml` starts PostgreSQL 16, Redis 7, MinIO, API, and web. Docker API is on `:3001`; local `pnpm start:dev` API is on `:3002`.
- `turbo.json` has `globalDependencies: [".env"]`; changing or adding `.env` invalidates turbo cache.
- There is currently no `.github/workflows/` directory in this checkout. Kubernetes manifests live in `kubernetes_proxmox/proyectos/legal-recovery` and expect `secrets/.env.secret` for kustomize.

## Backend notes (`apps/api`)

- Routes use `app.setGlobalPrefix("api")`; controllers include the version in their path (for example `@Controller("v1/auth")`). Do not add Nest URI versioning unless you rework routes.
- Swagger is at `/api/docs`; when adding a module, import it in `AppModule` and add the Swagger tag in `apps/api/src/main.ts`.
- Active modules in `AppModule`: Auth, Users, Institutions, Portfolios, Cases, Documents, DataPassports, Contacts, Consents, Rules, Scores, Agreements, Payments, Disputes, Communications, Reports, Audit. `AiModule` is still commented out.
- Global providers/interceptors: `PrismaModule` exports `PrismaService` + `LegalFirewallService`; `StorageModule` wraps MinIO/S3; `DecimalSerializeInterceptor` normalizes Prisma Decimal responses; `AuditInterceptor` logs mutations.
- Health route is `/api/v1/auth/healthz`. Kubernetes probes use this path; `apps/api/Dockerfile` currently checks `/api/v1/healthz`, which is a mismatch to fix before relying on Docker health.
- BullMQ config currently reads `REDIS_HOST`/`REDIS_PORT`, not `REDIS_URL`; set those when testing queues/portfolio async ingest.
- Prisma migrations directory only contains `migration_lock.toml` in this checkout; do not assume migrations exist just because `migrate deploy` appears in scripts/compose.

## Frontend notes (`apps/web`)

- Next.js is pinned to `15.5.18` with React 19 and Tailwind v4. `next.config.ts` disables standalone output on Windows to avoid symlink EPERM, disables ESLint during builds, and uses unoptimized images.
- The UI has three portal families under `/portal/admin`, `/portal/bank`, and `/portal/debtor`.
- Many pages still use static demo data from `apps/web/src/lib/seed-data.ts`; auth/API helpers store JWT/user in `localStorage`. Do not treat frontend auth as production-grade.
- `NEXT_PUBLIC_API_URL` defaults to `http://localhost:3002` in `src/lib/api-client.ts`; compose overrides it to `http://localhost:3001`.
- Web `test`, `test:integration`, and `test:e2e` scripts are no-ops that exit 0.

## Non-negotiable business rules

- Every sensitive field/action needs Data Passport provenance: source, legal basis, allowed/prohibited uses, restrictions, confidence, expiry/visibility, audit trail.
- Every sensitive access/contact/download/export must pass through the Legal Firewall (`LegalFirewallService` backend; `apps/web/src/lib/legal-firewall.ts` frontend mirror).
- Never contact unauthorized third parties; WhatsApp requires explicit opt-in and policy allowance; disputed/blocked cases and expired/restricted data must block.
- External sources (TSS, JCE, credit bureaus) require authorized integrations and valid legal basis; no scraping.
- AI/scoring may assist but must not auto-decide legally sensitive outcomes; preserve human review.
- Tenant isolation is by institution/portfolio/case. `Debtor` is global by unique `idNumber`; access must be governed via tenant-scoped `Case`, not by adding `institutionId` to `Debtor` casually.
- Audit logs for create/update/delete/download/contact flows must be immutable/append-only.
