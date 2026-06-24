"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const roles_guard_1 = require("./roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
class FakeClass {
}
function makeContext(user, roles) {
    const handler = function fakeHandler() { };
    if (roles && roles.length > 0) {
        Reflect.defineMetadata(roles_decorator_1.ROLES_KEY, roles, handler);
    }
    return {
        getHandler: () => handler,
        getClass: () => FakeClass,
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
    };
}
describe("RolesGuard", () => {
    let guard;
    beforeEach(() => {
        guard = new roles_guard_1.RolesGuard(new core_1.Reflector());
    });
    it("allows when no @Roles metadata is present (open endpoint)", () => {
        const ctx = makeContext({ role: "GESTOR" }, undefined);
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("allows when the JWT role (UPPER, from Prisma) matches a required role", () => {
        const ctx = makeContext({ role: "SUPER_ADMIN" }, [current_user_decorator_1.UserRole.SUPER_ADMIN]);
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("allows when the JWT role is one of several required roles", () => {
        const ctx = makeContext({ role: "ADMIN" }, [current_user_decorator_1.UserRole.ADMIN, current_user_decorator_1.UserRole.SUPER_ADMIN]);
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("allows a GESTOR on a gestor-accessible endpoint", () => {
        const ctx = makeContext({ role: "GESTOR" }, [current_user_decorator_1.UserRole.GESTOR]);
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it("denies (403) when the JWT role is not among the required roles", () => {
        const ctx = makeContext({ role: "GESTOR" }, [current_user_decorator_1.UserRole.ADMIN, current_user_decorator_1.UserRole.SUPER_ADMIN]);
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
    it("denies when the JWT role is BANCO for a staff-only endpoint", () => {
        const ctx = makeContext({ role: "BANCO" }, [current_user_decorator_1.UserRole.SUPER_ADMIN]);
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
    it("denies ('User role not found') when there is no authenticated user", () => {
        const ctx = makeContext(undefined, [current_user_decorator_1.UserRole.ADMIN]);
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
    it("regression pin: a lowercase enum against an UPPER JWT role is denied", () => {
        const handler = function fakeHandler() { };
        Reflect.defineMetadata(roles_decorator_1.ROLES_KEY, ["admin"], handler);
        const ctx = {
            getHandler: () => handler,
            getClass: () => FakeClass,
            switchToHttp: () => ({
                getRequest: () => ({ user: { role: "ADMIN" } }),
            }),
        };
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
    it("enum sync pin: UserRole members are persisted UPPER_CASE (match Prisma)", () => {
        expect(current_user_decorator_1.UserRole.SUPER_ADMIN).toBe("SUPER_ADMIN");
        expect(current_user_decorator_1.UserRole.ADMIN).toBe("ADMIN");
        expect(current_user_decorator_1.UserRole.SUPERVISOR).toBe("SUPERVISOR");
        expect(current_user_decorator_1.UserRole.GESTOR).toBe("GESTOR");
        expect(current_user_decorator_1.UserRole.ABOGADO).toBe("ABOGADO");
        expect(current_user_decorator_1.UserRole.COMPLIANCE).toBe("COMPLIANCE");
        expect(current_user_decorator_1.UserRole.BANCO).toBe("BANCO");
        expect(current_user_decorator_1.UserRole.DEUDOR).toBe("DEUDOR");
    });
});
//# sourceMappingURL=roles.guard.spec.js.map