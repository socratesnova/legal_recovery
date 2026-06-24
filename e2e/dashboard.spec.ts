import { test, expect } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers";

/**
 * UI end-to-end: drives the real Next.js app in a browser, logs in through the
 * real API, and asserts the dashboard renders cases fetched from the API
 * (not static demo data). This exercises CORS, JWT auth, and the /cases +
 * /reports/kpis endpoints through the browser fetch path.
 */
test.describe("admin dashboard (UI)", () => {
  test("login redirects to the dashboard and renders seeded cases", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Correo electrónico").fill(ADMIN_EMAIL);
    await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Entrar como Admin/ }).click();

    // Auth sets the token in localStorage, then the layout guard allows the
    // dashboard. The dashboard renders nothing while loading, so waiting for
    // the heading also waits for the API calls to settle.
    await expect(page).toHaveURL(/\/portal\/admin\/dashboard/);
    // The dashboard renders "Panel Ejecutivo" twice (an <h1> title and a small
    // <h2> section label). Pin level:1 to target the title unambiguously.
    await expect(
      page.getByRole("heading", { name: "Panel Ejecutivo", level: 1 }),
    ).toBeVisible();

    // The "Expedientes Prioritarios" table lists the seeded cases. If the
    // /cases fetch failed (CORS, auth, or API down) this would be empty —
    // so a non-empty table proves the real API path works through the browser.
    const caseRows = page.locator("table tbody tr");
    await expect(caseRows.first()).toBeVisible();
    const rowCount = await caseRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    // One of the seeded debtors (Juan Pérez / María García / Pedro Martínez)
    // must appear, proving the rows carry real API data.
    const debtorNames = ["Juan Pérez", "María García", "Pedro Martínez"];
    const pageText = await page.locator("table tbody").textContent();
    expect(
      debtorNames.some((n) => pageText?.includes(n)),
    ).toBeTruthy();
  });

  test("the admin sidebar lists the seeded user (post-login)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(ADMIN_EMAIL);
    await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Entrar como Admin/ }).click();
    await expect(page).toHaveURL(/\/portal\/admin\/dashboard/);

    // The layout reads the user profile from localStorage (set by login) and
    // shows the name in the top bar. The seeded admin is "Lic. María Fernández".
    // The name appears in several spots (top bar + mobile sidebar); .first()
    // pins the top-bar entry so strict mode doesn't complain about 3 matches.
    await expect(page.getByText("Lic. María Fernández").first()).toBeVisible();
  });
});