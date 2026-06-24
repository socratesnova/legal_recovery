import { test, expect } from "@playwright/test";
import { API_URL, loginAsAdmin, bearer } from "./helpers";

test.describe("reports", () => {
  test("GET /reports/kpis returns the dashboard aggregate shape", async ({
    request,
  }) => {
    const token = await loginAsAdmin(request);
    const res = await request.get(`${API_URL}/api/v1/reports/kpis`, {
      headers: bearer(token),
    });
    expect(res.status()).toBe(200);
    const kpis = (await res.json()) as {
      totalCases: number;
      casesByStatus: Record<string, number>;
      totalPortfolios: number;
      totalDebtors: number;
      totalAgreements: number;
      // The DecimalSerializeInterceptor normalizes Prisma Decimal → number on the
      // wire, so totalPaymentsAmount arrives as a number (not the decimal.js
      // string). The union is kept for safety; Number() below is belt-and-suspenders.
      totalPaymentsAmount: number | string;
      upcomingActions: unknown[];
    };
    expect(typeof kpis.totalCases).toBe("number");
    expect(kpis.totalCases).toBeGreaterThanOrEqual(3);
    expect(kpis.casesByStatus).toBeInstanceOf(Object);
    // Seed marks one case DISPUTED and the rest ACTIVE.
    expect(kpis.casesByStatus.ACTIVE ?? 0).toBeGreaterThanOrEqual(2);
    expect(kpis.totalPortfolios).toBeGreaterThanOrEqual(1);
    expect(kpis.totalDebtors).toBeGreaterThanOrEqual(3);
    // One RECONCILED payment of 33333 in the seed.
    expect(Number(kpis.totalPaymentsAmount)).toBeGreaterThanOrEqual(33333);
    // Pins the DecimalSerializeInterceptor contract: the wire value is a number.
    // If that interceptor regresses, this arrives as the string "33333" and fails.
    expect(typeof kpis.totalPaymentsAmount).toBe("number");
    expect(Array.isArray(kpis.upcomingActions)).toBe(true);
  });
});