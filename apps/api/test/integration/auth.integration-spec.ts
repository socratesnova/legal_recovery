import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/common/prisma.service";
import * as bcrypt from "bcrypt";

describe("AuthController (integration)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "test@legalrecovery.do", password: "SecureP@ss1" })
      .expect(200);

    expect(response.body).toHaveProperty("access_token");
    expect(response.body.access_token).toMatch(/^eyJ/);
  });

  it("POST /api/v1/auth/login rejects invalid credentials", async () => {
    await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "test@legalrecovery.do", password: "WrongPassword1" })
      .expect(401);
  });

  it("GET /api/v1/healthz returns ok without auth", async () => {
    await request(app.getHttpServer())
      .get("/api/v1/auth/healthz")
      .expect(200, { status: "ok" });
  });
});
