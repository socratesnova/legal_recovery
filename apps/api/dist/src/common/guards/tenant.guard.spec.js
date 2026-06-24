"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tenant_guard_1 = require("./tenant.guard");
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
function makeContext(user) {
    return {
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
    };
}
describe("TenantGuard", () => {
    let guard;
    beforeEach(() => {
        guard = new tenant_guard_1.TenantGuard();
    });
    it("denies ('Authentication required') when there is no user on the request", () => {
        expect(() => guard.canActivate(makeContext(undefined))).toThrow(common_1.ForbiddenException);
    });
    it("allows SUPER_ADMIN across institutions (bypass)", () => {
        const ctx = makeContext({
            userId: "u1",
            email: "admin@legalrecovery.do",
            role: current_user_decorator_1.UserRole.SUPER_ADMIN,
        });
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("allows SUPER_ADMIN even without an institutionId", () => {
        const ctx = makeContext({
            userId: "u1",
            email: "admin@legalrecovery.do",
            role: current_user_decorator_1.UserRole.SUPER_ADMIN,
        });
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("allows a non-superadmin who is assigned to an institution", () => {
        const ctx = makeContext({
            userId: "u2",
            email: "gestor@legalrecovery.do",
            role: current_user_decorator_1.UserRole.GESTOR,
            institutionId: "inst-001",
        });
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("allows a BANCO user assigned to their institution", () => {
        const ctx = makeContext({
            userId: "u3",
            email: "banco@banco.do",
            role: current_user_decorator_1.UserRole.BANCO,
            institutionId: "inst-bank",
        });
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("denies a non-superadmin with no institutionId", () => {
        const ctx = makeContext({
            userId: "u4",
            email: "orphan@legalrecovery.do",
            role: current_user_decorator_1.UserRole.GESTOR,
        });
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
    it("regression pin: a LOWER_CASE 'super_admin' JWT role does NOT bypass", () => {
        const ctx = makeContext({
            userId: "u1",
            email: "admin@legalrecovery.do",
            role: "super_admin",
        });
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
});
//# sourceMappingURL=tenant.guard.spec.js.map