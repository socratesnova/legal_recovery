import { Test } from "@nestjs/testing";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { PortfolioRulesService } from "./portfolio-rules.service";
import { PrismaService } from "../common/prisma.service";
import { UserRole } from "../common/decorators/current-user.decorator";

const gestor = {
  userId: "u1",
  email: "g@inst1.do",
  role: UserRole.GESTOR,
  institutionId: "inst1",
};

const superAdmin = {
  userId: "u9",
  email: "root@lr.do",
  role: UserRole.SUPER_ADMIN,
};

function makePrisma() {
  return {
    institution: { findUnique: jest.fn() },
    portfolioRule: { findUnique: jest.fn(), upsert: jest.fn() },
    portfolio: { findUnique: jest.fn() },
  };
}

describe("PortfolioRulesService", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;
  let service: PortfolioRulesService;

  beforeEach(async () => {
    prisma = makePrisma();
    const moduleRef = await Test.createTestingModule({
      providers: [
        PortfolioRulesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(PortfolioRulesService);
  });

  describe("getEffectiveRules", () => {
    it("merges institution + portfolio rules", async () => {
      prisma.institution.findUnique.mockResolvedValue({
        maxDiscountAuto: 10,
        maxDiscountManual: 20,
        minInstallments: 1,
        maxInstallments: 36,
        autoApprovalLimit: 10000,
      });
      prisma.portfolioRule.findUnique.mockResolvedValue({
        discountMax: 15,
        minInstallments: 3,
        maxInstallments: 12,
        autoApprovalLimit: 3000,
        channelsAllowed: ["PHONE", "EMAIL"],
      });

      const r = await service.getEffectiveRules("inst1", "port1");
      expect(r).toEqual({
        discountHardMax: 15,
        discountAutoMax: 10,
        minInstallments: 3,
        maxInstallments: 12,
        autoApprovalLimit: 3000,
        channelsAllowed: ["PHONE", "EMAIL"],
      });
    });

    it("uses institution caps alone when no portfolio rule exists", async () => {
      prisma.institution.findUnique.mockResolvedValue({
        maxDiscountAuto: 10,
        maxDiscountManual: 20,
        minInstallments: 2,
        maxInstallments: 24,
        autoApprovalLimit: 5000,
      });
      prisma.portfolioRule.findUnique.mockResolvedValue(null);

      const r = await service.getEffectiveRules("inst1", "port1");
      expect(r.discountHardMax).toBe(20);
      expect(r.discountAutoMax).toBe(10);
      expect(r.autoApprovalLimit).toBe(5000);
      expect(r.channelsAllowed).toBeNull();
    });

    it("returns all-null rules when neither is configured", async () => {
      prisma.institution.findUnique.mockResolvedValue(null);
      prisma.portfolioRule.findUnique.mockResolvedValue(null);

      const r = await service.getEffectiveRules("inst1", "port1");
      expect(r).toEqual({
        discountHardMax: null,
        discountAutoMax: null,
        minInstallments: null,
        maxInstallments: null,
        autoApprovalLimit: null,
        channelsAllowed: null,
      });
    });

    it("coerces Decimal fields to numbers", async () => {
      prisma.institution.findUnique.mockResolvedValue({
        maxDiscountAuto: 12.5,
        maxDiscountManual: 25,
        minInstallments: 1,
        maxInstallments: 36,
        autoApprovalLimit: 7500,
      });
      prisma.portfolioRule.findUnique.mockResolvedValue(null);

      const r = await service.getEffectiveRules("inst1", "port1");
      expect(r.discountAutoMax).toBe(12.5);
      expect(r.discountHardMax).toBe(25);
    });
  });

  describe("getForPortfolio", () => {
    it("returns the rule for a portfolio in the user's tenant", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst1",
        deletedAt: null,
      });
      const rule = { portfolioId: "port1", discountMax: 15 };
      prisma.portfolioRule.findUnique.mockResolvedValue(rule);

      const result = await service.getForPortfolio("port1", gestor);
      expect(result).toEqual(rule);
    });

    it("throws 404 when the portfolio does not exist", async () => {
      prisma.portfolio.findUnique.mockResolvedValue(null);
      await expect(
        service.getForPortfolio("nope", gestor),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.portfolioRule.findUnique).not.toHaveBeenCalled();
    });

    it("throws 403 when the portfolio belongs to another institution", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst2",
        deletedAt: null,
      });
      await expect(
        service.getForPortfolio("port1", gestor),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("allows super_admin to read any tenant's portfolio rule", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst-other",
        deletedAt: null,
      });
      prisma.portfolioRule.findUnique.mockResolvedValue({
        portfolioId: "port1",
      });
      const result = await service.getForPortfolio("port1", superAdmin);
      expect(result).toEqual({ portfolioId: "port1" });
    });

    it("treats a soft-deleted portfolio as not found", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst1",
        deletedAt: new Date(),
      });
      await expect(
        service.getForPortfolio("port1", gestor),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("upsertForPortfolio", () => {
    it("creates the rule when none exists", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst1",
        deletedAt: null,
      });
      const created = { portfolioId: "port1", discountMax: 15 };
      prisma.portfolioRule.upsert.mockResolvedValue(created);

      const result = await service.upsertForPortfolio(
        "port1",
        { discountMax: 15, minInstallments: 3 },
        gestor,
      );
      expect(result).toEqual(created);
      expect(prisma.portfolioRule.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { portfolioId: "port1" },
          create: { portfolioId: "port1", discountMax: 15, minInstallments: 3 },
          update: { discountMax: 15, minInstallments: 3 },
        }),
      );
    });

    it("only carries through provided fields", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst1",
        deletedAt: null,
      });
      prisma.portfolioRule.upsert.mockResolvedValue({ portfolioId: "port1" });

      await service.upsertForPortfolio("port1", { discountMax: 10 }, gestor);

      const call = prisma.portfolioRule.upsert.mock.calls[0][0];
      expect(call.create).toEqual({ portfolioId: "port1", discountMax: 10 });
      expect(call.update).toEqual({ discountMax: 10 });
    });

    it("throws 403 when the portfolio belongs to another institution", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst2",
        deletedAt: null,
      });
      await expect(
        service.upsertForPortfolio("port1", { discountMax: 10 }, gestor),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(prisma.portfolioRule.upsert).not.toHaveBeenCalled();
    });

    it("allows super_admin to upsert any tenant's rule", async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: "port1",
        institutionId: "inst-other",
        deletedAt: null,
      });
      prisma.portfolioRule.upsert.mockResolvedValue({ portfolioId: "port1" });
      const result = await service.upsertForPortfolio(
        "port1",
        { discountMax: 10 },
        superAdmin,
      );
      expect(result).toEqual({ portfolioId: "port1" });
    });
  });
});
