# E2E tests (Playwright)

End-to-end tests that drive the **real stack** (NestJS API + Next.js web + Postgres/Redis/MinIO)
through a browser and over REST. They do **not** use static demo data — they log in through
the real API and assert data fetched from the seeded database.

## Layout

| File | What it covers |
|------|----------------|
| `helpers.ts` | login + shared constants (seeded creds, portfolio id) |
| `auth.spec.ts` | `/auth/login`: valid/invalid creds, JWT shape, protected-endpoint gating |
| `cases.spec.ts` | `/cases`: list shape, detail by id, 404 |
| `reports.spec.ts` | `/reports/kpis`: dashboard aggregate shape |
| `portfolio-rules.spec.ts` | `GET/PUT /portfolios/:id/rules` — read, upsert, RBAC (gestor 403), tenant isolation |
| `dashboard.spec.ts` | UI: login → dashboard → cases table renders real API data |

## Prerequisites (run once, from repo root)

1. **Infra** (Postgres 16 / Redis 7 / MinIO) via Docker Compose:

   ```bash
   docker-compose up -d postgres redis minio
   ```

2. **Migrate + seed** the dev DB (`legal_recovery`). Use the **local Prisma 6**
   (`pnpm --filter api exec prisma`), not `npx prisma` (which may resolve a global
   Prisma 7 that rejects the `url` datasource):

   ```bash
   export DATABASE_URL="postgresql://legal_recovery:legal_recovery_dev_2024@localhost:5432/legal_recovery?schema=public"
   pnpm --filter api exec prisma migrate deploy
   pnpm db:seed
   ```

3. **Install Playwright + browsers** (once):

   ```bash
   pnpm add -D -w @playwright/test
   pnpm exec playwright install chromium
   ```

## Bring up the app (two terminals)

Pick free ports if 3003/3004 are in use; set `E2E_API_URL`/`E2E_WEB_URL` to match.

**API** (port 3003, CORS for the web on 3004):

```bash
cd apps/api
export DATABASE_URL="postgresql://legal_recovery:legal_recovery_dev_2024@localhost:5432/legal_recovery?schema=public"
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="local-dev-jwt-secret-at-least-32-characters-long"
export WEB_URL="http://localhost:3004"
export MINIO_ENDPOINT="localhost" MINIO_ACCESS_KEY="minioadmin" MINIO_SECRET_KEY="minioadmin123" MINIO_BUCKET="legal-recovery" MINIO_USE_SSL="false"
export PORT=3003
pnpm start:dev
```

**Web** (port 3004, pointing at the API on 3003):

```bash
cd apps/web
export NEXT_PUBLIC_API_URL="http://localhost:3003"
export PORT=3004
pnpm dev
```

## Run the suite

```bash
# From repo root, against the running stack
pnpm exec playwright test

# Or via the root script
pnpm e2e

# UI mode for debugging
pnpm exec playwright test --ui
```

Override URLs (e.g. different ports) without editing files:

```bash
E2E_WEB_URL=http://localhost:3010 E2E_API_URL=http://localhost:3011 pnpm exec playwright test
```

## Notes

- The suite runs single-worker (`workers: 1`) because `portfolio-rules.spec.ts`
  mutates the seeded portfolio rule and then restores it in `afterAll`; parallel
  workers would race on that shared state.
- Decimal fields (`discountMax`, `autoApprovalLimit`, `totalBalance`, `amount`)
  serialize as JSON strings via `decimal.js-light`'s `toJSON`; specs coerce with
  `Number()`.
- The `portfolio-rules` suite is non-destructive: `beforeAll` resets the rule to
  seed defaults (guards against leftover state from an interrupted prior run)
  and `afterAll` restores them, so the dev DB is left clean for the next run.