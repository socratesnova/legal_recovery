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
describe("Multi-tenant case isolation (integration)", () => {
    let app;
    let prisma;
    let caseAId;
    const password = "SecureP@ss1";
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
        const institutionA = await prisma.institution.create({
            data: {
                name: "Bank A",
                country: "DO",
                taxId: "A123456789",
                type: "BANK",
            },
        });
        const institutionB = await prisma.institution.create({
            data: {
                name: "Bank B",
                country: "DO",
                taxId: "B123456789",
                type: "BANK",
            },
        });
        await prisma.user.create({
            data: {
                email: "gestor.a@example.com",
                passwordHash: await bcrypt.hash(password, 10),
                name: "Gestor A",
                role: "GESTOR",
                institutionId: institutionA.id,
                status: "ACTIVE",
            },
        });
        await prisma.user.create({
            data: {
                email: "gestor.b@example.com",
                passwordHash: await bcrypt.hash(password, 10),
                name: "Gestor B",
                role: "GESTOR",
                institutionId: institutionB.id,
                status: "ACTIVE",
            },
        });
        const portfolioA = await prisma.portfolio.create({
            data: {
                institutionId: institutionA.id,
                name: "Portfolio A",
                type: "ASSIGNED",
                totalAmount: 1000,
            },
        });
        const debtorA = await prisma.debtor.create({
            data: { firstName: "Juan", lastName: "Perez", idNumber: "001-0000001-1" },
        });
        const caseA = await prisma.case.create({
            data: {
                institutionId: institutionA.id,
                portfolioId: portfolioA.id,
                debtorId: debtorA.id,
                caseNumber: "CASE-A-001",
                totalBalance: 500,
            },
        });
        caseAId = caseA.id;
    });
    afterAll(async () => {
        await app.close();
    });
    async function login(email) {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .post("/api/v1/auth/login")
            .send({ email, password })
            .expect(200);
        return res.body.access_token;
    }
    it("GESTOR in tenant B does not see tenant A's case in the list", async () => {
        const tokenB = await login("gestor.b@example.com");
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get("/api/v1/cases")
            .set("Authorization", `Bearer ${tokenB}`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.find((c) => c.id === caseAId)).toBeUndefined();
    });
    it("GESTOR in tenant B is forbidden from reading tenant A's case", async () => {
        const tokenB = await login("gestor.b@example.com");
        await (0, supertest_1.default)(app.getHttpServer())
            .get(`/api/v1/cases/${caseAId}`)
            .set("Authorization", `Bearer ${tokenB}`)
            .expect(403);
    });
    it("GESTOR in tenant A sees their own case", async () => {
        const tokenA = await login("gestor.a@example.com");
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/api/v1/cases/${caseAId}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .expect(200);
        expect(res.body.id).toBe(caseAId);
    });
    it("GESTOR in tenant A sees their case in the list", async () => {
        const tokenA = await login("gestor.a@example.com");
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get("/api/v1/cases")
            .set("Authorization", `Bearer ${tokenA}`)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.find((c) => c.id === caseAId)).toBeDefined();
    });
    it("rejects requests without a token", async () => {
        await (0, supertest_1.default)(app.getHttpServer()).get("/api/v1/cases").expect(401);
    });
});
//# sourceMappingURL=cases-tenant.integration-spec.js.map