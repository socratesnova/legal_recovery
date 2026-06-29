import { NextRequest, NextResponse } from "next/server";

/**
 * Auth middleware for the protected portal routes.
 *
 * Strategy: validate the JWT by calling the backend's `GET /api/v1/auth/me`
 * (which already requires a valid bearer token). If the user is authenticated,
 * attach `x-user-id`, `x-user-email`, and `x-user-role` headers so server
 * components / route handlers can read them without re-decoding the token.
 *
 * The token is read from either the `access_token` cookie (preferred for
 * production) or the `token` localStorage value (legacy/demo). The localStorage
 * case is handled by reading the cookie `auth_token` that the login page sets
 * as a stop-gap; a future iteration will move to HttpOnly Secure SameSite=Lax
 * cookies set by the backend.
 *
 * Public routes (login, root, static assets, /api/*) are excluded via matcher.
 *
 * Why proxy-validation instead of local JWT decode:
 * - No need to expose JWT_SECRET to the client bundle.
 * - Survives a future migration to Keycloak / Auth0 (only the backend changes).
 * - Single source of truth for "is this token still valid" (revocation, etc.).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
const PROTECTED_PREFIXES = ["/portal/admin", "/portal/bank", "/portal/debtor"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function readToken(req: NextRequest): string | null {
  // Production path: HttpOnly cookie set by the backend on /auth/login.
  // Stop-gap: client-side `auth_token` cookie set by the login page so the
  // middleware can see the value (localStorage is not accessible from the
  // Edge/Node middleware).
  const cookieToken = req.cookies.get("auth_token")?.value;
  if (cookieToken) return cookieToken;

  // Authorization header (e.g. server actions or direct API calls).
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = readToken(req);
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Validate by proxying to the backend. This avoids re-implementing JWT
  // verification and revocation logic on the client.
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      // Edge runtime requires absolute URLs and forbids following some
      // redirects; we don't want any caching of auth state.
      cache: "no-store",
      // Fail fast: 3s is enough for a healthy backend.
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete("auth_token");
      return response;
    }

    const user = (await res.json()) as {
      id: string;
      email: string;
      role: string;
      institutionId?: string;
    };

    // Forward identity to downstream handlers / server components.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-email", user.email);
    requestHeaders.set("x-user-role", user.role);
    if (user.institutionId) {
      requestHeaders.set("x-institution-id", user.institutionId);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    // Backend unreachable or timed out — fail closed (redirect to login) so we
    // never serve protected pages to an unauthenticated visitor.
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    url.searchParams.set("reason", "auth_unavailable");
    return NextResponse.redirect(url);
  }
}

export const config = {
  // Run only on portal routes; exclude /api, /_next, /login, static files.
  matcher: ["/portal/:path*"],
};
