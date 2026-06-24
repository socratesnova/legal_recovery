import "reflect-metadata";
import { TenantGuard } from "./tenant.guard";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { UserRole } from "../decorators/current-user.decorator";

/**
 * Pins TenantGuard's institution-scoping preconditions.
 *
 * TenantGuard does NOT itself match the request's resource institutionId
 * against the user's — that cross-tenant match is enforced inside each
 * service's Prisma `where` (filtered by the user's institutionId). The guard's
 * job is the precondition: a non-SUPER_ADMIN MUST carry an institutionId, and
 * SUPER_ADMIN is exempt (cross-institution access, still audit-logged).
 *
 * The SUPER_ADMIN bypass is `user.role === UserRole.SUPER_ADMIN` — a strict
 * equal against the UPPER_CASE enum value. The regression pin below documents
 * that a LOWER_CASE JWT role (the enum-case bug class) would NOT trigger the
 * bypass and would fall through to the institutionId check.
 */
function makeContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe("TenantGuard", () => {
  let guard: TenantGuard;

  beforeEach(() => {
    guard = new TenantGuard();
  });

  it("denies ('Authentication required') when there is no user on the request", () => {
    expect(() => guard.canActivate(makeContext(undefined))).toThrow(
      ForbiddenException,
    );
  });

  it("allows SUPER_ADMIN across institutions (bypass)", () => {
    const ctx = makeContext({
      userId: "u1",
      email: "admin@legalrecovery.do",
      role: UserRole.SUPER_ADMIN,
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows SUPER_ADMIN even without an institutionId", () => {
    // The bypass fires before the institutionId check, so a superadmin with no
    // assigned institution is still admitted (cross-institution role).
    const ctx = makeContext({
      userId: "u1",
      email: "admin@legalrecovery.do",
      role: UserRole.SUPER_ADMIN,
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows a non-superadmin who is assigned to an institution", () => {
    const ctx = makeContext({
      userId: "u2",
      email: "gestor@legalrecovery.do",
      role: UserRole.GESTOR,
      institutionId: "inst-001",
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows a BANCO user assigned to their institution", () => {
    const ctx = makeContext({
      userId: "u3",
      email: "banco@banco.do",
      role: UserRole.BANCO,
      institutionId: "inst-bank",
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("denies a non-superadmin with no institutionId", () => {
    const ctx = makeContext({
      userId: "u4",
      email: "orphan@legalrecovery.do",
      role: UserRole.GESTOR,
    });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("regression pin: a LOWER_CASE 'super_admin' JWT role does NOT bypass", () => {
    // `user.role === UserRole.SUPER_ADMIN` is a strict equal against "SUPER_ADMIN".
    // A JWT carrying "super_admin" (the enum-case bug class — Prisma always
    // persists UPPER, so this can't happen in prod, but a hand-crafted / stale
    // token could) would miss the bypass and fall through to the institutionId
    // check. This user has no institutionId -> denied. Documents the
    // case-sensitivity of the bypass.
    const ctx = makeContext({
      userId: "u1",
      email: "admin@legalrecovery.do",
      role: "super_admin" as unknown as UserRole,
    });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});