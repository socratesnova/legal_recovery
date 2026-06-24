import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { LegalFirewallService } from "./legal-firewall.service";
import { UserRole } from "../decorators/current-user.decorator";

const actor = {
  userId: "user-1",
  email: "gestor@test.com",
  role: UserRole.GESTOR,
  institutionId: "inst-1",
};

const baseCase = {
  id: "case-1",
  institutionId: "inst-1",
  debtorId: "debtor-1",
  status: "ACTIVE",
  disputes: [],
  dataPassports: [],
};

function buildPrismaMock(overrides: Partial<PrismaService> = {}) {
  const caseFindUnique = jest.fn();
  const consentFindMany = jest.fn().mockResolvedValue([]);
  const contactFindFirst = jest.fn().mockResolvedValue(null);
  const dataPassportFindFirst = jest.fn().mockResolvedValue(null);
  const dataRestrictionFindMany = jest.fn().mockResolvedValue([]);
  const dataRestrictionFindFirst = jest.fn().mockResolvedValue(null);
  return {
    case: {
      findUnique: caseFindUnique,
      ...(overrides as { case?: object }).case,
    },
    consent: { findMany: consentFindMany },
    contact: { findFirst: contactFindFirst },
    dataPassport: { findFirst: dataPassportFindFirst },
    dataRestriction: {
      findMany: dataRestrictionFindMany,
      findFirst: dataRestrictionFindFirst,
    },
    ...overrides,
  } as unknown as PrismaService & {
    case: { findUnique: jest.Mock };
    consent: { findMany: jest.Mock };
    contact: { findFirst: jest.Mock };
    dataPassport: { findFirst: jest.Mock };
    dataRestriction: { findMany: jest.Mock; findFirst: jest.Mock };
  };
}

describe("LegalFirewallService", () => {
  let service: LegalFirewallService;
  let prisma: ReturnType<typeof buildPrismaMock>;

  beforeEach(async () => {
    prisma = buildPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegalFirewallService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<LegalFirewallService>(LegalFirewallService);
  });

  afterEach(() => jest.clearAllMocks());

  const contactEval = (channel: string) =>
    service.canUseData(actor, {
      caseId: "case-1",
      purpose: "contact",
      channel,
    });

  it("denies when the case is not found", async () => {
    prisma.case.findUnique.mockResolvedValue(null);
    const result = await contactEval("WHATSAPP");
    expect(result.allowed).toBe(false);
    expect(result.reasons).toContain("Case not found.");
  });

  it("blocks all management when case status is DISPUTED", async () => {
    prisma.case.findUnique.mockResolvedValue({
      ...baseCase,
      status: "DISPUTED",
    });
    const result = await contactEval("WHATSAPP");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/DISPUTED/);
  });

  it("blocks all management when case status is BLOCKED", async () => {
    prisma.case.findUnique.mockResolvedValue({
      ...baseCase,
      status: "BLOCKED",
    });
    const result = await contactEval("PHONE");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/BLOCKED/);
  });

  it("blocks when there is an active dispute regardless of status", async () => {
    prisma.case.findUnique.mockResolvedValue({
      ...baseCase,
      disputes: [{ id: "d1", status: "OPEN" }],
    });
    const result = await contactEval("PHONE");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/active dispute/);
  });

  it("blocks WhatsApp when there is no active consent", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.consent.findMany.mockResolvedValue([]);
    const result = await contactEval("WHATSAPP");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/WhatsApp requires explicit/);
  });

  it("allows WhatsApp when an active consent exists and no no_whatsapp restriction", async () => {
    prisma.case.findUnique.mockResolvedValue({
      ...baseCase,
      dataPassports: [],
    });
    prisma.consent.findMany.mockResolvedValue([
      { id: "c1", granted: true, revokedAt: null },
    ]);
    const result = await contactEval("WHATSAPP");
    expect(result.allowed).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("blocks WhatsApp when no_whatsapp is in the case passport prohibitedUses", async () => {
    prisma.case.findUnique.mockResolvedValue({
      ...baseCase,
      dataPassports: [
        {
          fieldName: "communication",
          prohibitedUses: ["no_whatsapp"],
          allowedUses: [],
          visibilityRoles: [],
          status: "ACTIVE",
        } as never,
      ],
    });
    prisma.consent.findMany.mockResolvedValue([
      { id: "c1", granted: true, revokedAt: null },
    ]);
    const result = await contactEval("WHATSAPP");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/no_whatsapp/);
  });

  it("blocks EMAIL when no authorized email contact and no email consent", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.contact.findFirst.mockResolvedValue(null);
    prisma.consent.findMany.mockResolvedValue([]);
    const result = await contactEval("EMAIL");
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/email/);
  });

  it("allows EMAIL when an authorized email contact exists", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.contact.findFirst.mockResolvedValue({ id: "ct-1", optIn: true });
    prisma.consent.findMany.mockResolvedValue([]);
    const result = await contactEval("EMAIL");
    expect(result.allowed).toBe(true);
  });

  it("blocks view when no Data Passport exists for the field", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.dataPassport.findFirst.mockResolvedValue(null);
    const result = await service.canUseData(actor, {
      caseId: "case-1",
      purpose: "view",
      entityType: "debtor",
      entityId: "debtor-1",
      fieldName: "phone",
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/No Data Passport/);
  });

  it("blocks view when the passport is BLOCKED", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.dataPassport.findFirst.mockResolvedValue({
      status: "BLOCKED",
      visibilityRoles: [],
      prohibitedUses: [],
      expirationDate: null,
    } as never);
    const result = await service.canUseData(actor, {
      caseId: "case-1",
      purpose: "view",
      entityType: "debtor",
      entityId: "debtor-1",
      fieldName: "phone",
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/BLOCKED/);
  });

  it("blocks view when the actor role is not in visibilityRoles", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.dataPassport.findFirst.mockResolvedValue({
      status: "ACTIVE",
      visibilityRoles: ["compliance", "super_admin"],
      prohibitedUses: [],
      expirationDate: null,
    } as never);
    const result = await service.canUseData(actor, {
      caseId: "case-1",
      purpose: "view",
      entityType: "debtor",
      entityId: "debtor-1",
      fieldName: "phone",
    });
    expect(result.allowed).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/not authorized/);
  });

  it("allows view when passport is ACTIVE and role is visible", async () => {
    prisma.case.findUnique.mockResolvedValue(baseCase);
    prisma.dataPassport.findFirst.mockResolvedValue({
      status: "ACTIVE",
      visibilityRoles: ["gestor", "compliance"],
      prohibitedUses: [],
      expirationDate: null,
    } as never);
    const result = await service.canUseData(actor, {
      caseId: "case-1",
      purpose: "view",
      entityType: "debtor",
      entityId: "debtor-1",
      fieldName: "phone",
    });
    expect(result.allowed).toBe(true);
  });

  it("assertCanUse throws ForbiddenException when denied", async () => {
    prisma.case.findUnique.mockResolvedValue(null);
    await expect(
      service.assertCanUse(actor, {
        caseId: "missing",
        purpose: "contact",
        channel: "WHATSAPP",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
