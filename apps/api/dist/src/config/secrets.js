"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidJwtSecret = assertValidJwtSecret;
function assertValidJwtSecret(secret) {
    if (!secret) {
        throw new Error("JWT_SECRET is required but was not provided. Configure it in your " +
            "environment (see .env.example). Refusing to start with no JWT secret.");
    }
    if (secret.length < 32) {
        throw new Error(`JWT_SECRET must be at least 32 characters (got ${secret.length}). ` +
            "Generate a strong random secret. Refusing to start with a weak JWT secret.");
    }
    if (secret.startsWith("CHANGE_ME")) {
        throw new Error("JWT_SECRET is still the .env.example placeholder value. Generate a " +
            "real random secret before running. Refusing to start.");
    }
    return secret;
}
//# sourceMappingURL=secrets.js.map