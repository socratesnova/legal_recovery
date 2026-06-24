import { test, expect } from "@playwright/test";
import { API_URL, loginAsAdmin, bearer } from "./helpers";

test.describe("cases", () => {
  test("admin sees the seeded cases with the expected shape", async ({
    request,
  }) => {
    const token = await loginAsAdmin(request);
    const res = await request.get(`${API_URL}/api/v1/cases`, {
      headers: bearer(token),
    });
    expect(res.status()).toBe(200);
    const cases = (await res.json()) as Array<Record<string, unknown>>;
    expect(Array.isArray(cases)).toBe(true);
    // The seed creates 3 cases in the single seeded institution; the admin is
    // SUPER_ADMIN so findAll returns all of them.
    expect(cases.length).toBeGreaterThanOrEqual(3);

    const first = cases[0] as {
      id: string;
      caseNumber: string;
      status: string;
      // The DecimalSerializeInterceptor normalizes Prisma Decimal → number, so
      // totalBalance arrives as a number (the union is kept for safety).
      totalBalance: number | string;
      debtor: { firstName: string; lastName: string; idNumber: string };
      products: { productType: string }[];
    };
    expect(first.id).toBeTruthy();
    expect(first.caseNumber).toMatch(/^CASE-/);
    expect(["ACTIVE", "DISPUTED", "BLOCKED", "CLOSED", "RESTRICTED"]).toContain(
      first.status,
    );
    expect(first.debtor).toBeTruthy();
    expect(first.debtor.firstName.length).toBeGreaterThan(0);
    expect(first.products).toBeInstanceOf(Array);
    // Pins the DecimalSerializeInterceptor contract: totalBalance is a number
    // on the wire. If the interceptor regresses, this arrives as the string
    // "250000" and the assertion fails.
    expect(typeof first.totalBalance).toBe("number");
  });

  test("a case can be fetched by id with its full relations", async ({
    request,
  }) => {
    const token = await loginAsAdmin(request);
    const list = await request.get(`${API_URL}/api/v1/cases`, {
      headers: bearer(token),
    });
    const [first] = (await list.json()) as Array<{ id: string }>;

    const res = await request.get(`${API_URL}/api/v1/cases/${first.id}`, {
      headers: bearer(token),
    });
    expect(res.status()).toBe(200);
    const detail = (await res.json()) as {
      id: string;
      debtor: { contacts: unknown[] };
      agreements: unknown[];
      payments: unknown[];
    };
    expect(detail.id).toBe(first.id);
    // findById includes debtor.contacts, agreements, payments, etc.
    expect(detail.debtor).toBeTruthy();
    expect(Array.isArray(detail.agreements)).toBe(true);
  });

  test("a nonexistent case id returns 404", async ({ request }) => {
    const token = await loginAsAdmin(request);
    const res = await request.get(
      `${API_URL}/api/v1/cases/00000000-0000-0000-0000-000000000999`,
      { headers: bearer(token) },
    );
    expect(res.status()).toBe(404);
  });
});