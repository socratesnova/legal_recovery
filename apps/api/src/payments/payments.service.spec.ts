import { Test } from "@nestjs/testing";
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
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
    payment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    case: { findUnique: jest.fn() },
    agreement: { findUnique: jest.fn() },
  };
}

describe("PaymentsService", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;
  let service: PaymentsService;

  beforeEach(async () => {
    prisma = makePrisma();
    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(PaymentsService);
  });

  describe("findAll", () => {
    it("scopes by institution and excludes soft-deleted payments", async () => {
      prisma.payment.findMany.mockResolvedValue([]);
      await service.findAll(undefined, gestor);
      expect(prisma.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            institutionId: "inst1",
          }),
        }),
      );
    });

    it("rejects a gestor without an institution", async () => {
      await expect(
        service.findAll(undefined, { ...gestor, institutionId: undefined }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("findById", () => {
    it("throws 404 for a soft-deleted payment", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "p1",
        institutionId: "inst1",
        deletedAt: new Date(),
      });
      await expect(service.findById("p1", gestor)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("throws 403 for another tenant's payment", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "p1",
        institutionId: "inst2",
        deletedAt: null,
      });
      await expect(service.findById("p1", gestor)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe("create", () => {
    const baseDto = {
      caseId: "c1",
      institutionId: "inst1",
      amount: 500,
      method: "CASH" as const,
    };

    it("throws 404 when the case does not exist", async () => {
      prisma.case.findUnique.mockResolvedValue(null);
      await expect(service.create(baseDto, gestor)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it("throws 403 when the case belongs to another institution", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst2",
      });
      await expect(service.create(baseDto, gestor)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it("creates a payment against an approved agreement", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
      });
      prisma.agreement.findUnique.mockResolvedValue({
        id: "a1",
        institutionId: "inst1",
        status: "APPROVED",
      });
      prisma.payment.create.mockResolvedValue({ id: "p1" });

      await service.create({ ...baseDto, agreementId: "a1" }, gestor);

      expect(prisma.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            caseId: "c1",
            agreementId: "a1",
            amount: 500,
            method: "CASH",
            status: "PENDING",
          }),
        }),
      );
    });

    it("rejects a payment against a draft agreement", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
      });
      prisma.agreement.findUnique.mockResolvedValue({
        id: "a1",
        institutionId: "inst1",
        status: "DRAFT",
      });

      await expect(
        service.create({ ...baseDto, agreementId: "a1" }, gestor),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it("rejects a payment against a pending-approval agreement", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
      });
      prisma.agreement.findUnique.mockResolvedValue({
        id: "a1",
        institutionId: "inst1",
        status: "PENDING_APPROVAL",
      });

      await expect(
        service.create({ ...baseDto, agreementId: "a1" }, gestor),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("throws 404 when the referenced agreement does not exist", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
      });
      prisma.agreement.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ ...baseDto, agreementId: "a1" }, gestor),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws 403 when the agreement belongs to another institution", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
      });
      prisma.agreement.findUnique.mockResolvedValue({
        id: "a1",
        institutionId: "inst2",
        status: "APPROVED",
      });

      await expect(
        service.create({ ...baseDto, agreementId: "a1" }, gestor),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("creates a payment without an agreement", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst1",
      });
      prisma.payment.create.mockResolvedValue({ id: "p1" });

      await service.create(baseDto, gestor);

      expect(prisma.agreement.findUnique).not.toHaveBeenCalled();
      expect(prisma.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ agreementId: undefined }),
        }),
      );
    });

    it("rejects a gestor without an institution", async () => {
      await expect(
        service.create(baseDto, { ...gestor, institutionId: undefined }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("lets super_admin create a payment for any institution", async () => {
      prisma.case.findUnique.mockResolvedValue({
        id: "c1",
        institutionId: "inst-other",
      });
      prisma.payment.create.mockResolvedValue({ id: "p1" });

      await service.create(
        { ...baseDto, institutionId: "inst-other" },
        superAdmin,
      );

      expect(prisma.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ institutionId: "inst-other" }),
        }),
      );
    });
  });

  describe("reconcile", () => {
    it("marks the payment reconciled with the acting user", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "p1",
        institutionId: "inst1",
        deletedAt: null,
      });
      prisma.payment.update.mockResolvedValue({ id: "p1" });

      await service.reconcile("p1", gestor);

      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "p1" },
          data: expect.objectContaining({
            status: "RECONCILED",
            reconciledBy: gestor.userId,
            reconciledAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe("remove", () => {
    it("soft-deletes the payment", async () => {
      prisma.payment.findUnique.mockResolvedValue({
        id: "p1",
        institutionId: "inst1",
        deletedAt: null,
      });
      prisma.payment.update.mockResolvedValue({ id: "p1" });

      await service.remove("p1", gestor);

      expect(prisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "p1" },
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        }),
      );
    });
  });
});
