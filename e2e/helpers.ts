import type { APIRequestContext } from "@playwright/test";

/**
 * Shared E2E helpers — login + constants for the seeded dev DB.
 *
 * These credentials come from `apps/api/scripts/seed.ts`:
 *   admin@legalrecovery.do / demo1234  (SUPER_ADMIN, Banco Popular Dominicano)
 *   gestor@legalrecovery.do / demo1234 (GESTOR, same institution)
 * Re-seeding is idempotent (upsert with empty update), so these are stable.
 *
 * NOTE: the domain is .do (República Dominicana ccTLD). The seed previously
 * used .rd, which is NOT a real TLD — @IsEmail() (validator.js) rejects it,
 * so login returned 400 instead of 201. .do is a valid TLD and passes validation.
 */
export const API_URL = process.env.E2E_API_URL || "http://localhost:3003";

export const ADMIN_EMAIL = "admin@legalrecovery.do";
export const ADMIN_PASSWORD = "demo1234";
export const GESTOR_EMAIL = "gestor@legalrecovery.do";
export const GESTOR_PASSWORD = "demo1234";

/** Seeded portfolio id (fixed UUID in seed.ts). */
export const SEEDED_PORTFOLIO_ID = "00000000-0000-0000-0000-000000000001";

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/** POST /api/v1/auth/login and return the bearer token. Throws on non-2xx. */
export async function login(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const res = await request.post(`${API_URL}/api/v1/auth/login`, {
    data: { email, password },
  });
  if (!res.ok()) {
    throw new Error(
      `login failed for ${email}: HTTP ${res.status()} ${await res.text()}`,
    );
  }
  const body = (await res.json()) as LoginResponse;
  if (!body.access_token) {
    throw new Error(`login succeeded but no access_token returned for ${email}`);
  }
  return body.access_token;
}

export const loginAsAdmin = (request: APIRequestContext) =>
  login(request, ADMIN_EMAIL, ADMIN_PASSWORD);

export const loginAsGestor = (request: APIRequestContext) =>
  login(request, GESTOR_EMAIL, GESTOR_PASSWORD);

/** Authorization header object for a bearer token. */
export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });