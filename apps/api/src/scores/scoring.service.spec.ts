import { Test } from "@nestjs/testing";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { ScoringService, computeScores, ScoreInput } from "./scoring.service";
import { PrismaService } from "../common/prisma.service";
import { UserRole } from "../common/decorators/current-user.decorator";

const baseInput: ScoreInput = {
  status: "ACTIVE",
  totalBalance: 1000,
  hasIdNumber: true,
  documentCount: 1,
  productCount: 1,
  contactCount: 2,
  activeDataPassportCount: 1,
  channels: { phone: true, email: true, whatsappOptIn: false, address: false },
  communicationConsent: true,
  paidAmount: 500,
  activeAgreement: true,
  draftAgreement: false,
  activeDispute: false,
  pendingOrBrokenPromise: false,
};

describe("computeScores (pure)", () => {
  it("scores a healthy case with partial recovery", () => {
    const r = computeScores(baseInput);
    expect(r.scoreDocumental).toBe(85); // 20+20+20+15+10
    expect(r.scoreContactability).toBe(70); // 30+25+15
    expect(r.scoreRecoverability).toBe(70); // 25+20+10+15
    expect(r.scoreRisk).toBe(15); // (100-70)*0.5
    expect(r.nextBestAction).toContain("próximo pago");
  });

  it("returns 5 recoverability and a blocked message for a BLOCKED case", () => {
    const r = computeScores({ ...baseInput, status: "BLOCKED" });
    expect(r.scoreRecoverability).toBe(5);
    expect(r.nextBestAction).toContain("bloqueado");
  });

  it("caps recoverability and routes to dispute resolution for an active dispute", () => {
    const r = computeScores({
      ...baseInput,
      activeDispute: true,
      activeAgreement: false,
      paidAmount: 0,
    });
    expect(r.scoreRecoverability).toBeLessThanOrEqual(15);
    expect(r.nextBestAction).toContain("disputa");
  });

  it("routes to contact update when contactability is low", () => {
    const r = computeScores({
      ...baseInput,
      channels: {
        phone: false,
        email: false,
        whatsappOptIn: false,
        address: false,
      },
      communicationConsent: false,
      contactCount: 0,
      activeAgreement: false,
      paidAmount: 0,
    });
    expect(r.scoreContactability).toBe(0);
    expect(r.nextBestAction).toContain("datos de contacto");
  });

  it("routes to documentation request when documental is low", () => {
    const r = computeScores({
      ...baseInput,
      hasIdNumber: false,
      documentCount: 0,
      productCount: 0,
      contactCount: 0,
      activeDataPassportCount: 0,
      channels: {
        phone: true,
        email: true,
        whatsappOptIn: true,
        address: true,
      },
      activeAgreement: false,
      paidAmount: 0,
    });
    expect(r.scoreDocumental).toBe(0);
    expect(r.nextBestAction).toContain("documentación");
  });

  it("routes to approve draft agreement", () => {
    const r = computeScores({
      ...baseInput,
      draftAgreement: true,
      activeAgreement: false,
      paidAmount: 0,
    });
    expect(r.nextBestAction).toContain("borrador");
  });

  it("routes to manage a broken promise", () => {
    const r = computeScores({
      ...baseInput,
      pendingOrBrokenPromise: true,
      activeAgreement: false,
      paidAmount: 0,
    });
    expect(r.nextBestAction).toContain("incumplimiento");
  });

  it("routes to settlement offer when recovery is very low", () => {
    const r = computeScores({
      ...baseInput,
      paidAmount: 0,
      activeAgreement: false,
      draftAgreement: false,
      pendingOrBrokenPromise: false,
    });
    // recoverability = 0*50 + 0 + 0 + 15(no dispute) = 15 < 20
    expect(r.scoreRecoverability).toBeLessThan(20);
    expect(r.nextBestAction).toContain("quita");
  });

  it("risk grows with dispute, no contact, no payments", () => {
    const r = computeScores({
      ...baseInput,
      activeDispute: true,
      contactCount: 0,
      paidAmount: 0,
      activeAgreement: false,
      channels: {
        phone: false,
        email: false,
        whatsappOptIn: false,
        address: false,
      },
      communicationConsent: false,
      totalBalance: 200000,
    });
    // recoverability capped at 15 → (100-15)*0.5=42.5→43 +20(dispute)+15(no contact)+10(no pay)+5(balance) = 93
    expect(r.scoreRisk).toBeGreaterThanOrEqual(90);
  });
});

describe("ScoringService", () => {
  let service: ScoringService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      case: { findUnique: jest.fn(), update: jest.fn() },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [ScoringService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(ScoringService);
  });

  const gestor = {
    userId: "u1",
    email: "a@b.c",
    role: UserRole.GESTOR,
    institutionId: "inst1",
  };

  const record = {
    id: "c1",
    institutionId: "inst1",
    status: "ACTIVE",
    totalBalance: 1000,
    deletedAt: null,
    debtor: {
      idNumber: "001",
      contacts: [
        { channel: "PHONE", optIn: false },
        { channel: "EMAIL", optIn: false },
      ],
      consents: [{ type: "COMMUNICATION", granted: true, revokedAt: null }],
    },
    products: [{ id: "p1" }],
    documents: [{ id: "d1" }],
    agreements: [{ status: "ACTIVE", promises: [] }],
    payments: [{ amount: 500, status: "VERIFIED", reconciledAt: null }],
    disputes: [],
    dataPassports: [{ expirationDate: null }],
  };

  describe("scoreCase", () => {
    it("computes, persists, and returns the scores", async () => {
      prisma.case.findUnique.mockResolvedValue(record);
      prisma.case.update.mockResolvedValue({});

      const result = await service.scoreCase("c1", gestor);

      expect(prisma.case.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "c1" } }),
      );
      expect(prisma.case.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "c1" },
          data: expect.objectContaining({
            scoreDocumental: 85,
            scoreRecoverability: 70,
            scoreContactability: 70,
            scoreRisk: 15,
            nextAction: expect.any(String),
          }),
        }),
      );
      expect(result.caseId).toBe("c1");
      expect(result.computedAt).toBeInstanceOf(Date);
    });

    it("rejects when the case does not exist", async () => {
      prisma.case.findUnique.mockResolvedValue(null);
      await expect(service.scoreCase("nope", gestor)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.case.update).not.toHaveBeenCalled();
    });

    it("rejects another tenant's case", async () => {
      prisma.case.findUnique.mockResolvedValue({
        ...record,
        institutionId: "other-inst",
      });
      await expect(service.scoreCase("c1", gestor)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it("allows super_admin to score any tenant's case", async () => {
      const admin = { ...gestor, role: UserRole.SUPER_ADMIN };
      prisma.case.findUnique.mockResolvedValue({
        ...record,
        institutionId: "other-inst",
      });
      prisma.case.update.mockResolvedValue({});
      const result = await service.scoreCase("c1", admin);
      expect(result.caseId).toBe("c1");
    });
  });

  describe("getScores", () => {
    it("returns the persisted scores", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
        deletedAt: null,
        scoreDocumental: 80,
        scoreRecoverability: 60,
        scoreContactability: 50,
        scoreRisk: 30,
        nextAction:
          "Iniciar la gestión de contacto por el canal permitido más directo.",
      });
      const result = await service.getScores("c1", gestor);
      expect(result).toEqual({
        caseId: "c1",
        scoreDocumental: 80,
        scoreRecoverability: 60,
        scoreContactability: 50,
        scoreRisk: 30,
        nextAction:
          "Iniciar la gestión de contacto por el canal permitido más directo.",
      });
    });

    it("rejects when the case does not exist", async () => {
      prisma.case.findUnique.mockResolvedValue(null);
      await expect(service.getScores("nope", gestor)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
