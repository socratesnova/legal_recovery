import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config for Legal Recovery OS.
 *
 * The suite drives the real stack end-to-end (browser UI + REST API). It does
 * NOT auto-start the services: the infra (Postgres/Redis/MinIO via Docker), the
 * NestJS API and the Next.js web app must already be running. See
 * `e2e/README.md` for the exact bring-up commands.
 *
 * URLs are env-driven so the same suite runs locally and in CI:
 *   E2E_WEB_URL  – web app origin the browser drives  (default http://localhost:3004)
 *   E2E_API_URL  – API origin for REST assertions      (default http://localhost:3003)
 *
 * Defaults match the bring-up in e2e/README.md (API on 3003, web on 3004).
 * Override both if you run the stack on different ports.
 */
const WEB_URL = process.env.E2E_WEB_URL || "http://localhost:3004";
const API_URL = process.env.E2E_API_URL || "http://localhost:3003";
// Expose API base to specs through process.env (specs import it themselves).
process.env.E2E_API_URL = API_URL;

export default defineConfig({
  testDir: "./e2e",
  // Single worker: the suite shares one seeded DB and mutates portfolio
  // rules; parallel workers would race on that shared state.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: WEB_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});