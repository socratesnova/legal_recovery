"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const prisma_service_1 = require("../common/prisma.service");
const legal_firewall_service_1 = require("../common/services/legal-firewall.service");
const communications_service_1 = require("./communications.service");
const notification_dispatcher_1 = require("./notification-dispatcher");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const actor = {
    userId: "user-1",
    email: "gestor@test.com",
    role: current_user_decorator_1.UserRole.GESTOR,
    institutionId: "inst-1",
};
const mockCase = {
    id: "case-1",
    institutionId: "inst-1",
    debtorId: "debtor-1",
};
describe("CommunicationsService", () => {
    let service;
    let prisma;
    let firewall;
    let dispatcher;
    beforeEach(async () => {
        prisma = {
            case: { findUnique: jest.fn().mockResolvedValue(mockCase) },
            communication: {
                create: jest
                    .fn()
                    .mockImplementation(({ data }) => Promise.resolve({ id: "comm-1", ...data })),
                update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({
                    id: where.id,
                    ...data,
                    case: { id: "case-1", caseNumber: "PF-1" },
                })),
            },
            contact: { findFirst: jest.fn(), findUnique: jest.fn() },
        };
        firewall = { canUseData: jest.fn() };
        dispatcher = { dispatch: jest.fn() };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                communications_service_1.CommunicationsService,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
                { provide: legal_firewall_service_1.LegalFirewallService, useValue: firewall },
                { provide: notification_dispatcher_1.NotificationDispatcher, useValue: dispatcher },
            ],
        }).compile();
        service = module.get(communications_service_1.CommunicationsService);
    });
    afterEach(() => jest.clearAllMocks());
    it("creates PENDING then dispatches and persists SENT when the firewall allows (email, simulated)", async () => {
        firewall.canUseData.mockResolvedValue({ allowed: true, reasons: [] });
        prisma.contact.findFirst.mockResolvedValue({ value: "debtor@test.com" });
        dispatcher.dispatch.mockResolvedValue({
            status: "SENT",
            simulated: true,
            providerMessageId: "simulated-abc",
        });
        const result = await service.create({
            caseId: "case-1",
            channel: "EMAIL",
            contentSummary: "reminder",
        }, actor, "10.0.0.1");
        expect(firewall.canUseData).toHaveBeenCalledWith(actor, expect.objectContaining({
            caseId: "case-1",
            purpose: "contact",
            channel: "EMAIL",
        }));
        expect(prisma.communication.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                status: "PENDING",
                blocked: false,
                blockReason: null,
                ipAddress: "10.0.0.1",
                userId: "user-1",
            }),
        }));
        expect(dispatcher.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            channel: "EMAIL",
            to: "debtor@test.com",
            contentSummary: "reminder",
        }));
        expect(prisma.communication.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: "comm-1" },
            data: expect.objectContaining({
                status: "SENT",
                simulated: true,
                providerMessageId: "simulated-abc",
            }),
        }));
        expect(result.status).toBe("SENT");
        expect(result.simulated).toBe(true);
    });
    it("fails the communication when no destination contact is on file for a provider channel", async () => {
        firewall.canUseData.mockResolvedValue({ allowed: true, reasons: [] });
        prisma.contact.findFirst.mockResolvedValue(null);
        const result = await service.create({ caseId: "case-1", channel: "EMAIL", contentSummary: "hi" }, actor);
        expect(prisma.communication.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ status: "PENDING" }),
        }));
        expect(dispatcher.dispatch).not.toHaveBeenCalled();
        expect(prisma.communication.update).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ status: "FAILED" }),
        }));
        expect(result.status).toBe("FAILED");
    });
    it("persists FAILED when the provider dispatch fails", async () => {
        firewall.canUseData.mockResolvedValue({ allowed: true, reasons: [] });
        prisma.contact.findFirst.mockResolvedValue({ value: "+15551234567" });
        dispatcher.dispatch.mockResolvedValue({
            status: "FAILED",
            simulated: false,
            providerMessageId: null,
            error: "boom",
        });
        const result = await service.create({ caseId: "case-1", channel: "SMS", contentSummary: "pay up" }, actor);
        expect(dispatcher.dispatch).toHaveBeenCalledWith(expect.objectContaining({ channel: "SMS", to: "+15551234567" }));
        expect(prisma.communication.update).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ status: "FAILED" }),
        }));
        expect(result.status).toBe("FAILED");
    });
    it("records manual channels (PHONE) with no destination and a simulated SENT", async () => {
        firewall.canUseData.mockResolvedValue({ allowed: true, reasons: [] });
        dispatcher.dispatch.mockResolvedValue({
            status: "SENT",
            simulated: true,
            providerMessageId: null,
        });
        const result = await service.create({
            caseId: "case-1",
            channel: "PHONE",
            contentSummary: "called, no answer",
        }, actor);
        expect(prisma.contact.findFirst).not.toHaveBeenCalled();
        expect(dispatcher.dispatch).toHaveBeenCalledWith(expect.objectContaining({ channel: "PHONE", to: null }));
        expect(result.status).toBe("SENT");
        expect(result.simulated).toBe(true);
    });
    it("creates a BLOCKED communication with reasons and does not dispatch when the firewall denies", async () => {
        firewall.canUseData.mockResolvedValue({
            allowed: false,
            reasons: ["WhatsApp requires explicit debtor opt-in."],
        });
        const result = await service.create({ caseId: "case-1", channel: "WHATSAPP" }, actor);
        expect(prisma.communication.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                status: "BLOCKED",
                blocked: true,
                blockReason: "WhatsApp requires explicit debtor opt-in.",
            }),
        }));
        expect(dispatcher.dispatch).not.toHaveBeenCalled();
        expect(prisma.communication.update).not.toHaveBeenCalled();
        expect(result.status).toBe("BLOCKED");
        expect(result.blocked).toBe(true);
    });
    it("throws NotFound when the case does not exist", async () => {
        prisma.case.findUnique.mockResolvedValue(null);
        await expect(service.create({ caseId: "missing", channel: "EMAIL" }, actor)).rejects.toThrow("Case not found");
    });
    it("rejects a communication on another tenant's case", async () => {
        prisma.case.findUnique.mockResolvedValue({
            ...mockCase,
            institutionId: "other-inst",
        });
        await expect(service.create({ caseId: "case-1", channel: "EMAIL" }, actor)).rejects.toThrow("does not belong to your institution");
        expect(dispatcher.dispatch).not.toHaveBeenCalled();
    });
    it("uses the explicit contactId destination when provided and valid", async () => {
        firewall.canUseData.mockResolvedValue({ allowed: true, reasons: [] });
        prisma.contact.findUnique.mockResolvedValue({
            value: "direct@debtor.com",
            channel: "EMAIL",
            deletedAt: null,
            debtorId: "debtor-1",
        });
        dispatcher.dispatch.mockResolvedValue({
            status: "SENT",
            simulated: false,
            providerMessageId: "real-msg-id",
        });
        const result = await service.create({
            caseId: "case-1",
            contactId: "contact-1",
            channel: "EMAIL",
            contentSummary: "direct",
        }, actor);
        expect(prisma.contact.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "contact-1" } }));
        expect(dispatcher.dispatch).toHaveBeenCalledWith(expect.objectContaining({
            to: "direct@debtor.com",
            contactId: "contact-1",
        }));
        expect(result.status).toBe("SENT");
        expect(result.simulated).toBe(false);
    });
});
//# sourceMappingURL=communications.service.spec.js.map