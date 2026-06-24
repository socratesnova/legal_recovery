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
//# sourceMappingURL=setup-env.js.map