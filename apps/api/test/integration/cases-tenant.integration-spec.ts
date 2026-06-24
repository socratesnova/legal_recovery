import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/common/prisma.service";
import * as bcrypt from "bcrypt";

/**
 * Integration test for critical business rule #1: tenant isolation.
 *
 * Two institutions (A, B) each get a GESTOR. A owns a case. We assert that
 * tenant B's gestor can neither list nor read A's case (filter by
 * institutionId on findAll, ForbiddenException on cross-tenant findById),
 * while tenant A's gestor sees their own case. A tokenless request is 401.
 */
describe("Multi-tenant case isolation (integration)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let caseAId: string;

  const password = "SecureP@ss1";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mirror production main.ts so the test exercises real routing:
    // setGlobalPrefix("api") + version baked into controller paths -> /api/v1/...
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);
  });

  // Fixtures are created per-test (not in beforeAll) because setup.ts truncates
  // all tenant tables before each test for hermetic isolation.
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

  async function login(email: string): Promise<string> {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email, password })
      .expect(200);
    return res.body.access_token as string;
  }

  it("GESTOR in tenant B does not see tenant A's case in the list", async () => {
    const tokenB = await login("gestor.b@example.com");
    const res = await request(app.getHttpServer())
      .get("/api/v1/cases")
      .set("Authorization", `Bearer ${tokenB}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find((c: { id: string }) => c.id === caseAId),
    ).toBeUndefined();
  });

  it("GESTOR in tenant B is forbidden from reading tenant A's case", async () => {
    const tokenB = await login("gestor.b@example.com");
    await request(app.getHttpServer())
      .get(`/api/v1/cases/${caseAId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .expect(403);
  });

  it("GESTOR in tenant A sees their own case", async () => {
    const tokenA = await login("gestor.a@example.com");
    const res = await request(app.getHttpServer())
      .get(`/api/v1/cases/${caseAId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);

    expect(res.body.id).toBe(caseAId);
  });

  it("GESTOR in tenant A sees their case in the list", async () => {
    const tokenA = await login("gestor.a@example.com");
    const res = await request(app.getHttpServer())
      .get("/api/v1/cases")
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find((c: { id: string }) => c.id === caseAId),
    ).toBeDefined();
  });

  it("rejects requests without a token", async () => {
    await request(app.getHttpServer()).get("/api/v1/cases").expect(401);
  });
});
