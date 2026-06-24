/**
 * Centralized secret validation with fail-fast behavior.
 *
 * A silently-falling-back default secret is a critical security hole: the old
 * `process.env.JWT_SECRET || "default-secret"` in AuthModule let anyone who read
 * the source forge valid JWTs whenever the env var was unset. It also created a
 * sign/verify mismatch — the signing side fell back to "default-secret" while
 * the verifying side (JwtStrategy) read `process.env.JWT_SECRET` with no
 * fallback, so protected endpoints returned 401 whenever the secret was
 * missing. These helpers throw loudly at boot instead, so a missing, weak, or
 * still-placeholder secret fails fast rather than weakening production.
 */

/**
 * Validates a JWT secret value, throwing a clear, actionable error if it is
 * missing, shorter than 32 characters, or still the .env.example placeholder.
 * Returns the secret unchanged when valid.
 */
export function assertValidJwtSecret(secret: string | undefined): string {
  if (!secret) {
    throw new Error(
      "JWT_SECRET is required but was not provided. Configure it in your " +
        "environment (see .env.example). Refusing to start with no JWT secret.",
    );
  }
  if (secret.length < 32) {
    throw new Error(
      `JWT_SECRET must be at least 32 characters (got ${secret.length}). ` +
        "Generate a strong random secret. Refusing to start with a weak JWT secret.",
    );
  }
  if (secret.startsWith("CHANGE_ME")) {
    throw new Error(
      "JWT_SECRET is still the .env.example placeholder value. Generate a " +
        "real random secret before running. Refusing to start.",
    );
  }
  return secret;
}
