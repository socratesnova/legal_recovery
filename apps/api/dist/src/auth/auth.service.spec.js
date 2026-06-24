"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("mock-hash"),
    compare: jest.fn(),
}));
const mockUsersService = {
    findByEmail: jest.fn(),
};
const mockJwtService = {
    sign: jest.fn().mockReturnValue("mock-jwt-token"),
};
describe("AuthService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("validateUser", () => {
        it("should return user (without passwordHash) when credentials are valid", async () => {
            const bcrypt = await Promise.resolve().then(() => __importStar(require("bcrypt")));
            const user = {
                id: "user-001",
                email: "admin@legalrecovery.do",
                name: "Admin",
                role: "SUPER_ADMIN",
                passwordHash: "$2b$10$hashed",
            };
            mockUsersService.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValueOnce(true);
            const result = await service.validateUser("admin@legalrecovery.do", "demo1234");
            expect(result).toEqual({
                id: "user-001",
                email: "admin@legalrecovery.do",
                name: "Admin",
                role: "SUPER_ADMIN",
            });
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith("admin@legalrecovery.do");
        });
        it("should return null when user is not found", async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            const result = await service.validateUser("missing@test.com", "password");
            expect(result).toBeNull();
        });
        it("should return null when user has no passwordHash", async () => {
            mockUsersService.findByEmail.mockResolvedValue({
                id: "user-002",
                email: "legacy@test.com",
                passwordHash: null,
            });
            const result = await service.validateUser("legacy@test.com", "password");
            expect(result).toBeNull();
        });
        it("should return null when password does not match", async () => {
            const bcrypt = await Promise.resolve().then(() => __importStar(require("bcrypt")));
            const user = {
                id: "user-003",
                email: "test@test.com",
                passwordHash: "$2b$10$hashed",
            };
            mockUsersService.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValueOnce(false);
            const result = await service.validateUser("test@test.com", "wrongpass");
            expect(result).toBeNull();
        });
    });
    describe("login", () => {
        it("should return access_token and user object", () => {
            const user = {
                id: "user-001",
                email: "admin@legalrecovery.do",
                name: "Admin",
                role: current_user_decorator_1.UserRole.SUPER_ADMIN,
                institutionId: "inst-001",
            };
            const result = service.login(user);
            expect(result.access_token).toBe("mock-jwt-token");
            expect(result.user).toEqual({
                id: "user-001",
                email: "admin@legalrecovery.do",
                name: "Admin",
                role: current_user_decorator_1.UserRole.SUPER_ADMIN,
                institutionId: "inst-001",
            });
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: "user-001",
                email: "admin@legalrecovery.do",
                role: current_user_decorator_1.UserRole.SUPER_ADMIN,
                institutionId: "inst-001",
            });
        });
    });
    describe("validateToken", () => {
        it("should be defined", () => {
            expect(service.validateToken).toBeDefined();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map