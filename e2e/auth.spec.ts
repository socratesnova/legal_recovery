import { test, expect } from "@playwright/test";
import { API_URL, ADMIN_EMAIL, ADMIN_PASSWORD, loginAsAdmin } from "./helpers";

test.describe("auth", () => {
  test("valid credentials return a JWT and the user profile", async ({
    request,
  }) => {
    const res = await request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    // AuthController uses @HttpCode(HttpStatus.OK) — login returns a token, it
    // does not create a resource, so 200 (not 201) is the correct status.
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.access_token).toBeTruthy();
    // JWT format: header.payload.signature (3 base64url segments).
    expect(body.access_token.split(".")).toHaveLength(3);
    expect(body.user.email).toBe(ADMIN_EMAIL);
    expect(body.user.role).toBe("SUPER_ADMIN");
  });

  test("invalid password is rejected with 401", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_EMAIL, password: "definitely-wrong-password" },
    });
    expect(res.status()).toBe(401);
  });

  test("unknown user is rejected with 401", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/v1/auth/login`, {
      data: { email: "nobody@legalrecovery.do", password: ADMIN_PASSWORD },
    });
    expect(res.status()).toBe(401);
  });

  test("protected endpoint rejects requests without a bearer token", async ({
    request,
  }) => {
    const res = await request.get(`${API_URL}/api/v1/cases`);
    expect(res.status()).toBe(401);
  });

  test("a valid bearer token grants access to a protected endpoint", async ({
    request,
  }) => {
    const token = await loginAsAdmin(request);
    const res = await request.get(`${API_URL}/api/v1/cases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
  });
});