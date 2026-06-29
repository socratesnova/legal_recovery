import "reflect-metadata";
import { RolesGuard } from "./roles.guard";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../decorators/current-user.decorator";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * Pins the RBAC enum-case fix and guards against its regression.
 *
 * Why this suite exists: the JWT payload carries `role` straight from the
 * Prisma row, and Prisma persists enum members by their UPPER_CASE member
 * name. So at runtime `req.user.role` is ALWAYS an UPPER_CASE string
 * ("SUPER_ADMIN", "GESTOR", ...) regardless of the casing of the local TS
 * `UserRole` enum.
 *
 * The original bug: the local TS `UserRole` enum was declared lowercase
 * (`ADMIN = "admin"`), so `@Roles(UserRole.ADMIN)` stored metadata `["admin"]`
 * and `RolesGuard` did `["admin"].includes("SUPER_ADMIN")` -> false -> every
 * `@Roles`-guarded endpoint returned 403 and every `user.role === UserRole.X`
 * bypass in services fell through to the restricted branch. The existing unit
 * suite never caught it because those specs built `user.role` from the SAME
 * lowercase enum, so both sides of the `includes()` agreed and the guard
 * passed trivially — the mismatch only surfaces against a real JWT.
 *
 * These tests pass `user.role` as a hardcoded UPPER_CASE string (exactly what
 * the JWT carries). If the enum is ever rebased to lowercase, `@Roles`
 * metadata goes lowercase but `user.role` stays UPPER -> `includes()` misses
 * -> the test throws, surfacing the regression.
 */
class FakeClass {}

function makeContext(
  user: { role: string } | undefined,
  roles: UserRole[] | undefined,
): ExecutionContext {
  // Fresh handler per call so metadata never leaks between tests.
  const handler = function fakeHandler() {};
  if (roles && roles.length > 0) {
    Reflect.defineMetadata(ROLES_KEY, roles, handler);
  }
  return {
    getHandler: () => handler,
    getClass: () => FakeClass,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe("RolesGuard", () => {
  let guard: RolesGuard;

  beforeEach(() => {
    // Reflector is a plain @nestjs/core class; no DI container needed to test
    // the guard in isolation.
    guard = new RolesGuard(new Reflector());
  });

  it("allows when no @Roles metadata is present (open endpoint)", () => {
    const ctx = makeContext({ role: "GESTOR" }, undefined);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows when the JWT role (UPPER, from Prisma) matches a required role", () => {
    // user.role is the string the JWT carries — always UPPER_CASE because the
    // auth service signs it straight from the Prisma row. @Roles uses the
    // local TS enum; the two must agree. This is the core of the fix.
    const ctx = makeContext({ role: "SUPER_ADMIN" }, [UserRole.SUPER_ADMIN]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows when the JWT role is one of several required roles", () => {
    const ctx = makeContext({ role: "ADMIN" }, [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows a GESTOR on a gestor-accessible endpoint", () => {
    const ctx = makeContext({ role: "GESTOR" }, [UserRole.GESTOR]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("denies (403) when the JWT role is not among the required roles", () => {
    const ctx = makeContext({ role: "GESTOR" }, [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("denies when the JWT role is BANCO for a staff-only endpoint", () => {
    const ctx = makeContext({ role: "BANCO" }, [UserRole.SUPER_ADMIN]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("denies ('User role not found') when there is no authenticated user", () => {
    const ctx = makeContext(undefined, [UserRole.ADMIN]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("regression pin: a lowercase enum against an UPPER JWT role is denied", () => {
    // Simulates the pre-fix state: @Roles stored ["admin"] (lowercase enum) but
    // the JWT carried "ADMIN" (UPPER, from Prisma). includes() missed -> 403.
    // If someone re-lowercases the enum, this is the exact failure mode that
    // returns, and this test documents why the guard could not catch it via
    // introspection alone.
    const handler = function fakeHandler() {};
    Reflect.defineMetadata(
      ROLES_KEY,
      ["admin"] as unknown as UserRole[],
      handler,
    );
    const ctx = {
      getHandler: () => handler,
      getClass: () => FakeClass,
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: "ADMIN" } }),
      }),
    } as unknown as ExecutionContext;
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("enum sync pin: UserRole members are persisted UPPER_CASE (match Prisma)", () => {
    // Belt-and-suspenders: the enum members themselves must equal their UPPER
    // string forms. If someone writes `ADMIN = "admin"`, this fails immediately
    // at the source of truth rather than only via an integration 403.
    expect(UserRole.SUPER_ADMIN).toBe("SUPER_ADMIN");
    expect(UserRole.ADMIN).toBe("ADMIN");
    expect(UserRole.SUPERVISOR).toBe("SUPERVISOR");
    expect(UserRole.GESTOR).toBe("GESTOR");
    expect(UserRole.ABOGADO).toBe("ABOGADO");
    expect(UserRole.COMPLIANCE).toBe("COMPLIANCE");
    expect(UserRole.BANCO).toBe("BANCO");
    expect(UserRole.DEUDOR).toBe("DEUDOR");
  });
});
