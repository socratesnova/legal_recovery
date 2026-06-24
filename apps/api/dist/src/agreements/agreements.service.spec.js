"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const agreements_service_1 = require("./agreements.service");
const prisma_service_1 = require("../common/prisma.service");
const portfolio_rules_service_1 = require("../rules/portfolio-rules.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const gestor = {
    userId: "u1",
    email: "g@inst1.do",
    role: current_user_decorator_1.UserRole.GESTOR,
    institutionId: "inst1",
};
const noRules = {
    discountHardMax: null,
    discountAutoMax: null,
    minInstallments: null,
    maxInstallments: null,
    autoApprovalLimit: null,
    channelsAllowed: null,
};
describe("AgreementsService", () => {
    let prisma;
    let rulesService;
    let service;
    beforeEach(async () => {
        prisma = {
            agreement: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
            case: { findUnique: jest.fn() },
        };
        rulesService = { getEffectiveRules: jest.fn() };
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                agreements_service_1.AgreementsService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
                { provide: portfolio_rules_service_1.PortfolioRulesService, useValue: rulesService },
            ],
        }).compile();
        service = moduleRef.get(agreements_service_1.AgreementsService);
    });
    const caseRecord = { id: "c1", institutionId: "inst1", portfolioId: "port1" };
    describe("findAll", () => {
        it("scopes by institution and excludes soft-deleted agreements", async () => {
            prisma.agreement.findMany.mockResolvedValue([]);
            await service.findAll(undefined, gestor);
            expect(prisma.agreement.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    deletedAt: null,
                    institutionId: "inst1",
                }),
            }));
        });
        it("rejects a gestor without an institution", async () => {
            await expect(service.findAll(undefined, { ...gestor, institutionId: undefined })).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
    });
    describe("findById", () => {
        it("throws 404 for a soft-deleted agreement", async () => {
            prisma.agreement.findUnique.mockResolvedValue({
                id: "a1",
                institutionId: "inst1",
                deletedAt: new Date(),
            });
            await expect(service.findById("a1", gestor)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
        it("throws 403 for another tenant's agreement", async () => {
            prisma.agreement.findUnique.mockResolvedValue({
                id: "a1",
                institutionId: "inst2",
                deletedAt: null,
            });
            await expect(service.findById("a1", gestor)).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
    });
    describe("create", () => {
        const baseDto = {
            caseId: "c1",
            institutionId: "inst1",
            type: "DISCOUNT",
            amount: 1000,
        };
        it("throws 404 when the case does not exist", async () => {
            prisma.case.findUnique.mockResolvedValue(null);
            await expect(service.create(baseDto, gestor)).rejects.toBeInstanceOf(common_1.NotFoundException);
            expect(prisma.agreement.create).not.toHaveBeenCalled();
        });
        it("throws 403 when the case belongs to another institution", async () => {
            prisma.case.findUnique.mockResolvedValue({
                ...caseRecord,
                institutionId: "inst2",
            });
            await expect(service.create(baseDto, gestor)).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
        it("auto-approves an agreement within the configured caps", async () => {
            prisma.case.findUnique.mockResolvedValue(caseRecord);
            rulesService.getEffectiveRules.mockResolvedValue({
                ...noRules,
                autoApprovalLimit: 5000,
            });
            prisma.agreement.create.mockResolvedValue({ id: "a1" });
            await service.create({ ...baseDto, type: "FULL_PAYMENT" }, gestor);
            expect(rulesService.getEffectiveRules).toHaveBeenCalledWith("inst1", "port1");
            expect(prisma.agreement.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    status: "APPROVED",
                    approvedBy: gestor.userId,
                    approvedAt: expect.any(Date),
                    createdBy: gestor.userId,
                }),
            }));
        });
        it("routes to pending approval when no auto limit is configured", async () => {
            prisma.case.findUnique.mockResolvedValue(caseRecord);
            rulesService.getEffectiveRules.mockResolvedValue(noRules);
            prisma.agreement.create.mockResolvedValue({ id: "a1" });
            await service.create({ ...baseDto, type: "FULL_PAYMENT" }, gestor);
            expect(prisma.agreement.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    status: "PENDING_APPROVAL",
                    approvedBy: null,
                    approvedAt: null,
                }),
            }));
        });
        it("routes a discount above the auto cap (but within hard cap) to manual", async () => {
            prisma.case.findUnique.mockResolvedValue(caseRecord);
            rulesService.getEffectiveRules.mockResolvedValue({
                ...noRules,
                discountHardMax: 20,
                discountAutoMax: 10,
                autoApprovalLimit: 5000,
            });
            prisma.agreement.create.mockResolvedValue({ id: "a1" });
            await service.create({ ...baseDto, discountPercentage: 15 }, gestor);
            expect(prisma.agreement.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    status: "PENDING_APPROVAL",
                    discountPercentage: 15,
                }),
            }));
        });
        it("rejects an agreement that violates the hard discount cap", async () => {
            prisma.case.findUnique.mockResolvedValue(caseRecord);
            rulesService.getEffectiveRules.mockResolvedValue({
                ...noRules,
                discountHardMax: 10,
            });
            await expect(service.create({ ...baseDto, discountPercentage: 25 }, gestor)).rejects.toBeInstanceOf(common_1.BadRequestException);
            expect(prisma.agreement.create).not.toHaveBeenCalled();
        });
        it("rejects an agreement with installments out of range", async () => {
            prisma.case.findUnique.mockResolvedValue(caseRecord);
            rulesService.getEffectiveRules.mockResolvedValue({
                ...noRules,
                minInstallments: 3,
                maxInstallments: 12,
            });
            await expect(service.create({ ...baseDto, type: "INSTALLMENTS", installments: 1 }, gestor)).rejects.toBeInstanceOf(common_1.BadRequestException);
            expect(prisma.agreement.create).not.toHaveBeenCalled();
        });
        it("respects an explicit status over auto-approval routing", async () => {
            prisma.case.findUnique.mockResolvedValue(caseRecord);
            rulesService.getEffectiveRules.mockResolvedValue({
                ...noRules,
                autoApprovalLimit: 5000,
            });
            prisma.agreement.create.mockResolvedValue({ id: "a1" });
            await service.create({ ...baseDto, type: "FULL_PAYMENT", status: "DRAFT" }, gestor);
            expect(prisma.agreement.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    status: "DRAFT",
                    approvedBy: null,
                    approvedAt: null,
                }),
            }));
        });
        it("rejects a gestor without an institution", async () => {
            await expect(service.create(baseDto, { ...gestor, institutionId: undefined })).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
    });
    describe("approve", () => {
        it("approves an agreement and records the approver", async () => {
            prisma.agreement.findUnique.mockResolvedValue({
                id: "a1",
                institutionId: "inst1",
                deletedAt: null,
            });
            prisma.agreement.update.mockResolvedValue({ id: "a1" });
            await service.approve("a1", gestor);
            expect(prisma.agreement.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: "a1" },
                data: expect.objectContaining({
                    status: "APPROVED",
                    approvedBy: gestor.userId,
                    approvedAt: expect.any(Date),
                }),
            }));
        });
    });
});
//# sourceMappingURL=agreements.service.spec.js.map