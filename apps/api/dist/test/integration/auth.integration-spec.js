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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../../src/app.module");
const prisma_service_1 = require("../../src/common/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
describe("AuthController (integration)", () => {
    let app;
    let prisma;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api");
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
    });
    beforeEach(async () => {
        const institution = await prisma.institution.create({
            data: {
                name: "Test Bank",
                country: "DO",
                taxId: "123456789",
                type: "BANK",
            },
        });
        await prisma.user.create({
            data: {
                email: "test@legalrecovery.do",
                passwordHash: await bcrypt.hash("SecureP@ss1", 10),
                name: "Test User",
                role: "GESTOR",
                institutionId: institution.id,
                status: "ACTIVE",
            },
        });
    });
    afterAll(async () => {
        await app.close();
    });
    it("POST /api/v1/auth/login returns JWT for valid credentials", async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post("/api/v1/auth/login")
            .send({ email: "test@legalrecovery.do", password: "SecureP@ss1" })
            .expect(200);
        expect(response.body).toHaveProperty("access_token");
        expect(response.body.access_token).toMatch(/^eyJ/);
    });
    it("POST /api/v1/auth/login rejects invalid credentials", async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .post("/api/v1/auth/login")
            .send({ email: "test@legalrecovery.do", password: "WrongPassword1" })
            .expect(401);
    });
    it("GET /api/v1/healthz returns ok without auth", async () => {
        await (0, supertest_1.default)(app.getHttpServer())
            .get("/api/v1/auth/healthz")
            .expect(200, { status: "ok" });
    });
});
//# sourceMappingURL=auth.integration-spec.js.map