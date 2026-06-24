/**
 * Loaded by jest `setupFiles` BEFORE any integration test file is evaluated.
 * Pins sane defaults for the integration environment so `pnpm test:integration`
 * works locally without manually exporting variables, while remaining a no-op
 * in CI, where the workflow sets DATABASE_URL / REDIS_URL / JWT_SECRET
 * explicitly (see .github/workflows/ci-cd.yml, test-integration job).
 *
 * The values here mirror that CI workflow and the dev credentials in
 * infra/docker/docker-compose.yml. They protect only the local/ephemeral test
 * database — never production.
 *
 * Why this is needed: the app's own .env points DATABASE_URL at the in-Docker
 * host `lr_postgres`, which is unreachable from the host machine. Without these
 * defaults, host-side integration runs would silently try to connect there and
 * fail with a confusing "database server at the configured address" error.
 */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://legal_recovery:legal_recovery_dev_2024@localhost:5432/legal_recovery_test?schema=public";
}
if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = "redis://localhost:6379";
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    "ci-integration-jwt-secret-for-ephemeral-test-db-only";
}
