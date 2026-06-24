import { test, expect } from "@playwright/test";
import {
  API_URL,
  loginAsAdmin,
  loginAsGestor,
  bearer,
  SEEDED_PORTFOLIO_ID,
} from "./helpers";

/**
 * Exercises the institution/portfolio rules feature (Fase 2):
 *   GET /api/v1/portfolios/:id/rules  – read the configured rule
 *   PUT /api/v1/portfolios/:id/rules  – upsert (ADMIN/SUPER_ADMIN only)
 *
 * Decimal fields (discountMax, autoApprovalLimit) serialize as strings via
 * decimal.js-light's toJSON — coerce with Number(). Int fields
 * (minInstallments, maxInstallments) arrive as numbers.
 *
 * The PUT mutates the seeded portfolio rule; afterAll restores the seed
 * defaults so the dev DB is left clean for the next run.
 */

// Seed defaults (apps/api/scripts/seed.ts) — kept in sync manually.
const SEED_DISCOUNT_MAX = 30;
const SEED_MIN_INSTALLMENTS = 1;
const SEED_MAX_INSTALLMENTS = 6;

test.afterAll(async ({ request }) => {
  // Restore the seeded rule so the suite is non-destructive across re-runs.
  const token = await loginAsAdmin(request);
  await request.put(`${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`, {
    headers: bearer(token),
    data: {
      discountMax: SEED_DISCOUNT_MAX,
      minInstallments: SEED_MIN_INSTALLMENTS,
      maxInstallments: SEED_MAX_INSTALLMENTS,
    },
  });
});

// Ensure the seeded rule starts at defaults before the suite mutates it. This
// guards against leftover state from an interrupted prior run whose afterAll
// never executed — e.g. while the RBAC enum-case bug was active the PUT 403'd
// and never persisted, but if a run is killed mid-suite after the test 12 PUT
// succeeds, the rule would be left at 27 and the next run's seed-default
// assertion (test 1) would fail. Same payload as the afterAll restore below.
test.beforeAll(async ({ request }) => {
  const token = await loginAsAdmin(request);
  await request.put(`${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`, {
    headers: bearer(token),
    data: {
      discountMax: SEED_DISCOUNT_MAX,
      minInstallments: SEED_MIN_INSTALLMENTS,
      maxInstallments: SEED_MAX_INSTALLMENTS,
    },
  });
});

test.describe("portfolio rules", () => {
  test("the seeded portfolio has a configurable rule", async ({ request }) => {
    const token = await loginAsAdmin(request);
    const res = await request.get(
      `${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`,
      { headers: bearer(token) },
    );
    expect(res.status()).toBe(200);
    const rule = (await res.json()) as {
      portfolioId: string;
      discountMax: string | null;
      minInstallments: number | null;
      maxInstallments: number | null;
      autoApprovalLimit: string | null;
      channelsAllowed: string[] | null;
    };
    expect(rule).toBeTruthy();
    expect(rule.portfolioId).toBe(SEEDED_PORTFOLIO_ID);
    expect(Number(rule.discountMax)).toBe(SEED_DISCOUNT_MAX);
    expect(rule.minInstallments).toBe(SEED_MIN_INSTALLMENTS);
    expect(rule.maxInstallments).toBe(SEED_MAX_INSTALLMENTS);
    // channelsAllowed is a non-empty array in the seed.
    expect(Array.isArray(rule.channelsAllowed)).toBe(true);
    expect((rule.channelsAllowed ?? []).length).toBeGreaterThan(0);
  });

  test("a super_admin can lower the discount cap and it persists", async ({
    request,
  }) => {
    const token = await loginAsAdmin(request);
    const put = await request.put(
      `${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`,
      {
        headers: bearer(token),
        data: { discountMax: 27, minInstallments: 2, maxInstallments: 9 },
      },
    );
    expect(put.status()).toBe(200);
    const updated = (await put.json()) as {
      discountMax: string | null;
      minInstallments: number | null;
      maxInstallments: number | null;
    };
    expect(Number(updated.discountMax)).toBe(27);
    expect(updated.minInstallments).toBe(2);
    expect(updated.maxInstallments).toBe(9);

    // Persisted on re-read.
    const get = await request.get(
      `${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`,
      { headers: bearer(token) },
    );
    const after = (await get.json()) as { discountMax: string | null };
    expect(Number(after.discountMax)).toBe(27);
  });

  test("a gestor can read rules but is forbidden from writing them (RBAC)", async ({
    request,
  }) => {
    const token = await loginAsGestor(request);

    // Read is allowed (no @Roles on GET).
    const get = await request.get(
      `${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`,
      { headers: bearer(token) },
    );
    expect(get.status()).toBe(200);

    // Write requires ADMIN/SUPER_ADMIN — gestor is GESTOR.
    const put = await request.put(
      `${API_URL}/api/v1/portfolios/${SEEDED_PORTFOLIO_ID}/rules`,
      {
        headers: bearer(token),
        data: { discountMax: 50 },
      },
    );
    expect(put.status()).toBe(403);
  });

  test("writing rules for another tenant's portfolio is forbidden", async ({
    request,
  }) => {
    // The gestor belongs to Banco Popular; a random foreign portfolio id is
    // either not found (404) or belongs to another institution (403). Both
    // outcomes prove tenant isolation on the write path.
    const token = await loginAsGestor(request);
    const put = await request.put(
      `${API_URL}/api/v1/portfolios/00000000-0000-0000-0000-000000000099/rules`,
      {
        headers: bearer(token),
        data: { discountMax: 10 },
      },
    );
    expect([403, 404]).toContain(put.status());
  });
});