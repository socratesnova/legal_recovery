# AGENTS.md — Legal Recovery OS

## Project state

**Pre-code.** No source code, build system, package manifests, or CI config exist yet. Do not assume commands like `npm test`, `lint`, or `typecheck` work.

**Infrastructure ready:** Dev VM on Proxmox at `10.166.166.60` with Docker, PostgreSQL 16, Redis, MinIO. See `DEPLOY_PROXMOX.md` for details.

## Where to find what

| Need | Read this |
|------|-----------|
| Product vision, backlog, acceptance criteria | `Legal_Recovery_OS_Documento_de_Alcance.md` |
| Stack decisions, monorepo layout, cost estimates | `PLAN_MAESTRO_IMPLEMENTACION.md` |
| Architecture, data model, business rules per module | `Legal_Recovery_OS_Prompts_Desarrollo/*.txt` (23 prompts) |
| Prompt index | `Legal_Recovery_OS_Prompts_Desarrollo/prompts_index.json` |
| Infrastructure / VM setup | `DEPLOY_PROXMOX.md` |

**The prompts are the canonical source of truth for code generation.** Every prompt repeats the 8 critical rules at the top. When generating code, read the relevant prompt first.

## Prompt execution order

Strict sequence — later prompts depend on earlier ones:

1. `01_prompt_maestro_producto.txt` — PRD, modules, backlog
2. `02_prompt_arquitectura_base.txt` — stack, architecture decisions
3. `03_prompt_modelo_datos_postgresql.txt` — schema
4. `04_prompt_backend_api.txt` — API
5. `05_prompt_frontend_nextjs.txt` — UI
6. `06–18` — functional modules (parallelizable after 1–5)
7. `19–21` — security/audit, DevOps, testing (cross-cutting)
8. `22_prompt_mvp_sprint_plan.txt` — sprint plan (last)

## Resolved tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Next.js 15 + React 19 + Tailwind + shadcn/ui | App Router, SSR/SSG |
| Backend | **NestJS** (TypeScript) | Not FastAPI. Modular: controllers, services, guards, pipes |
| ORM | Prisma | Schema as single source of truth, auto migrations |
| Auth | Keycloak (self-hosted) or Supabase Auth | MFA, RBAC/ABAC, SSO |
| Queues | Redis + BullMQ | Native NestJS integration |
| Files | MinIO (S3-compatible) | Migrate to S3/GCS later |
| AI microservice | FastAPI + LangChain + ChromaDB | **Only Python service.** Internal network only |
| BI | Metabase (self-hosted) | Connects directly to PostgreSQL |
| DB | PostgreSQL 16 | UUID PKs, `created_at`/`updated_at`/`deleted_at`, soft deletes |

## Architecture decisions

- **Three portals**: `/portal/admin` (legal office), `/portal/bank` (bank/fund), `/portal/debtor` (self-service)
- **Multi-tenant**: Shared DB, shared schema with `institution_id` on all tenant entities + PostgreSQL RLS policies
- **Data Passport + Legal Firewall**: Every sensitive field has a passport (source, legal basis, allowed/prohibited uses, expiration). `canUseData(user, data, purpose, channel)` gates all access → allow/deny/restrict
- **Entity states**: `active`, `restricted`, `blocked`, `disputed`, `closed`
- **API modules** (NestJS): `auth`, `users`, `institutions`, `portfolios`, `cases`, `documents`, `data-passports`, `contacts`, `consents`, `scores`, `agreements`, `payments`, `disputes`, `communications`, `reports`, `audit`, `ai`
- **Communication channel priority** (lowest cost/risk first): portal → email → QR letter → voicebot → SMS (selective) → WhatsApp (restricted/neutral only)

## Critical business rules — never violate

1. **Data provenance**: Every field must carry source, date, legal basis, allowed uses, restrictions, confidence score, audit trail. Block data without legal/contractual source.
2. **No unauthorized contact**: Block communication to unauthorized third parties.
3. **WhatsApp restrictions**: Restricted channel — opt-in + policy rules required. Never for direct mass collection.
4. **External data restrictions**: TSS, JCE, credit bureaus — only via authorized integrations with valid legal basis. No scraping.
5. **Human-in-the-loop**: Legally sensitive decisions require human review. AI never auto-decides these.
6. **Immutable audit logs**: Every create/update/delete/download/contact action logged immutably.
7. **RBAC/ABAC**: Access by role + institution + portfolio + data sensitivity. Multi-tenant isolation mandatory.
8. **No equal spending**: Every case needs budget, score, and next best action — do not spend equally on all.

## Testing priorities (once code exists)

Per `21_prompt_testing_qa.txt`, prioritize:
- Legal Firewall blocking: data without source, unauthorized contact, WhatsApp without opt-in, disputed cases, expired/restricted data
- RBAC/ABAC per institution and portfolio
- Audit log immutability
- Portfolio upload validation
- Debtor portal access boundaries