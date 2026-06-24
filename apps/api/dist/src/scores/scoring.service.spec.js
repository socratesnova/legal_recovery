"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const scoring_service_1 = require("./scoring.service");
const prisma_service_1 = require("../common/prisma.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const baseInput = {
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
        const r = (0, scoring_service_1.computeScores)(baseInput);
        expect(r.scoreDocumental).toBe(85);
        expect(r.scoreContactability).toBe(70);
        expect(r.scoreRecoverability).toBe(70);
        expect(r.scoreRisk).toBe(15);
        expect(r.nextBestAction).toContain("próximo pago");
    });
    it("returns 5 recoverability and a blocked message for a BLOCKED case", () => {
        const r = (0, scoring_service_1.computeScores)({ ...baseInput, status: "BLOCKED" });
        expect(r.scoreRecoverability).toBe(5);
        expect(r.nextBestAction).toContain("bloqueado");
    });
    it("caps recoverability and routes to dispute resolution for an active dispute", () => {
        const r = (0, scoring_service_1.computeScores)({
            ...baseInput,
            activeDispute: true,
            activeAgreement: false,
            paidAmount: 0,
        });
        expect(r.scoreRecoverability).toBeLessThanOrEqual(15);
        expect(r.nextBestAction).toContain("disputa");
    });
    it("routes to contact update when contactability is low", () => {
        const r = (0, scoring_service_1.computeScores)({
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
        const r = (0, scoring_service_1.computeScores)({
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
        const r = (0, scoring_service_1.computeScores)({
            ...baseInput,
            draftAgreement: true,
            activeAgreement: false,
            paidAmount: 0,
        });
        expect(r.nextBestAction).toContain("borrador");
    });
    it("routes to manage a broken promise", () => {
        const r = (0, scoring_service_1.computeScores)({
            ...baseInput,
            pendingOrBrokenPromise: true,
            activeAgreement: false,
            paidAmount: 0,
        });
        expect(r.nextBestAction).toContain("incumplimiento");
    });
    it("routes to settlement offer when recovery is very low", () => {
        const r = (0, scoring_service_1.computeScores)({
            ...baseInput,
            paidAmount: 0,
            activeAgreement: false,
            draftAgreement: false,
            pendingOrBrokenPromise: false,
        });
        expect(r.scoreRecoverability).toBeLessThan(20);
        expect(r.nextBestAction).toContain("quita");
    });
    it("risk grows with dispute, no contact, no payments", () => {
        const r = (0, scoring_service_1.computeScores)({
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
        expect(r.scoreRisk).toBeGreaterThanOrEqual(90);
    });
});
describe("ScoringService", () => {
    let service;
    let prisma;
    beforeEach(async () => {
        prisma = {
            case: { findUnique: jest.fn(), update: jest.fn() },
        };
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [scoring_service_1.ScoringService, { provide: prisma_service_1.PrismaService, useValue: prisma }],
        }).compile();
        service = moduleRef.get(scoring_service_1.ScoringService);
    });
    const gestor = {
        userId: "u1",
        email: "a@b.c",
        role: current_user_decorator_1.UserRole.GESTOR,
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
            expect(prisma.case.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "c1" } }));
            expect(prisma.case.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: "c1" },
                data: expect.objectContaining({
                    scoreDocumental: 85,
                    scoreRecoverability: 70,
                    scoreContactability: 70,
                    scoreRisk: 15,
                    nextAction: expect.any(String),
                }),
            }));
            expect(result.caseId).toBe("c1");
            expect(result.computedAt).toBeInstanceOf(Date);
        });
        it("rejects when the case does not exist", async () => {
            prisma.case.findUnique.mockResolvedValue(null);
            await expect(service.scoreCase("nope", gestor)).rejects.toBeInstanceOf(common_1.NotFoundException);
            expect(prisma.case.update).not.toHaveBeenCalled();
        });
        it("rejects another tenant's case", async () => {
            prisma.case.findUnique.mockResolvedValue({
                ...record,
                institutionId: "other-inst",
            });
            await expect(service.scoreCase("c1", gestor)).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
        it("allows super_admin to score any tenant's case", async () => {
            const admin = { ...gestor, role: current_user_decorator_1.UserRole.SUPER_ADMIN };
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
                nextAction: "Iniciar la gestión de contacto por el canal permitido más directo.",
            });
            const result = await service.getScores("c1", gestor);
            expect(result).toEqual({
                caseId: "c1",
                scoreDocumental: 80,
                scoreRecoverability: 60,
                scoreContactability: 50,
                scoreRisk: 30,
                nextAction: "Iniciar la gestión de contacto por el canal permitido más directo.",
            });
        });
        it("rejects when the case does not exist", async () => {
            prisma.case.findUnique.mockResolvedValue(null);
            await expect(service.getScores("nope", gestor)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=scoring.service.spec.js.map