"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const legal_firewall_service_1 = require("../common/services/legal-firewall.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const notification_dispatcher_1 = require("./notification-dispatcher");
let CommunicationsService = class CommunicationsService {
    constructor(prisma, firewall, dispatcher) {
        this.prisma = prisma;
        this.firewall = firewall;
        this.dispatcher = dispatcher;
    }
    async findAll(caseId, user) {
        const where = {};
        if (caseId) {
            where.caseId = caseId;
        }
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN) {
            if (!user.institutionId) {
                throw new common_1.ForbiddenException("User is not assigned to any institution");
            }
            where.case = { institutionId: user.institutionId };
        }
        return this.prisma.communication.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async findById(id, user) {
        const comm = await this.prisma.communication.findUnique({
            where: { id },
            include: {
                case: { select: { id: true, caseNumber: true, institutionId: true } },
            },
        });
        if (!comm) {
            throw new common_1.NotFoundException("Communication not found");
        }
        this.assertTenant(comm.case.institutionId, user);
        return comm;
    }
    async create(data, user, ipAddress) {
        const caseRecord = await this.prisma.case.findUnique({
            where: { id: data.caseId },
            select: { id: true, institutionId: true, debtorId: true },
        });
        if (!caseRecord) {
            throw new common_1.NotFoundException("Case not found");
        }
        this.assertTenant(caseRecord.institutionId, user);
        const firewallResult = await this.firewall.canUseData(user, {
            caseId: data.caseId,
            purpose: "contact",
            channel: data.channel,
        });
        const blocked = !firewallResult.allowed;
        if (blocked) {
            return this.prisma.communication.create({
                data: {
                    caseId: data.caseId,
                    contactId: data.contactId,
                    userId: user.userId,
                    channel: data.channel,
                    direction: data.direction ?? client_1.CommDirection.OUTBOUND,
                    contentSummary: data.contentSummary,
                    status: client_1.CommStatus.BLOCKED,
                    blocked: true,
                    blockReason: firewallResult.reasons.join(" | "),
                    ipAddress,
                },
                include: { case: { select: { id: true, caseNumber: true } } },
            });
        }
        const communication = await this.prisma.communication.create({
            data: {
                caseId: data.caseId,
                contactId: data.contactId,
                userId: user.userId,
                channel: data.channel,
                direction: data.direction ?? client_1.CommDirection.OUTBOUND,
                contentSummary: data.contentSummary,
                status: client_1.CommStatus.PENDING,
                blocked: false,
                blockReason: null,
                ipAddress,
            },
        });
        const destination = await this.resolveDestination(caseRecord, data.channel, data.contactId);
        const needsDestination = this.commChannelToContactChannel(data.channel) !== null;
        if (needsDestination && !destination) {
            return this.prisma.communication.update({
                where: { id: communication.id },
                data: {
                    status: client_1.CommStatus.FAILED,
                    simulated: false,
                    providerMessageId: null,
                },
                include: { case: { select: { id: true, caseNumber: true } } },
            });
        }
        const dispatchReq = {
            channel: data.channel,
            to: destination,
            contentSummary: data.contentSummary,
            caseId: data.caseId,
            contactId: data.contactId,
        };
        const result = await this.dispatcher.dispatch(dispatchReq);
        return this.prisma.communication.update({
            where: { id: communication.id },
            data: {
                status: result.status,
                simulated: result.simulated,
                providerMessageId: result.providerMessageId,
            },
            include: { case: { select: { id: true, caseNumber: true } } },
        });
    }
    async update(id, data, user) {
        const existing = await this.findById(id, user);
        if (existing.blocked &&
            data.status &&
            data.status !== client_1.CommStatus.BLOCKED &&
            data.status !== client_1.CommStatus.FAILED) {
            throw new common_1.ForbiddenException("Cannot mark a firewall-blocked communication as sent. Resolve the block first.");
        }
        const updateData = {
            contentSummary: data.contentSummary,
            status: data.status,
        };
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        return this.prisma.communication.update({
            where: { id },
            data: updateData,
        });
    }
    async resolveDestination(caseRecord, channel, contactId) {
        const contactChannel = this.commChannelToContactChannel(channel);
        if (!contactChannel)
            return null;
        if (contactId) {
            const contact = await this.prisma.contact.findUnique({
                where: { id: contactId },
                select: {
                    value: true,
                    channel: true,
                    deletedAt: true,
                    debtorId: true,
                },
            });
            if (!contact || contact.deletedAt || contact.channel !== contactChannel) {
                return null;
            }
            if (contact.debtorId !== caseRecord.debtorId)
                return null;
            return contact.value;
        }
        const contact = await this.prisma.contact.findFirst({
            where: {
                debtorId: caseRecord.debtorId,
                channel: contactChannel,
                deletedAt: null,
                optIn: true,
            },
            orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
            select: { value: true },
        });
        return contact?.value ?? null;
    }
    commChannelToContactChannel(channel) {
        switch (channel) {
            case client_1.CommChannel.EMAIL:
                return client_1.ContactChannel.EMAIL;
            case client_1.CommChannel.SMS:
                return client_1.ContactChannel.PHONE;
            case client_1.CommChannel.WHATSAPP:
                return client_1.ContactChannel.WHATSAPP;
            default:
                return null;
        }
    }
    assertTenant(institutionId, user) {
        if (user.role !== current_user_decorator_1.UserRole.SUPER_ADMIN &&
            institutionId !== user.institutionId) {
            throw new common_1.ForbiddenException("Communication does not belong to your institution");
        }
    }
};
exports.CommunicationsService = CommunicationsService;
exports.CommunicationsService = CommunicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        legal_firewall_service_1.LegalFirewallService,
        notification_dispatcher_1.NotificationDispatcher])
], CommunicationsService);
//# sourceMappingURL=communications.service.js.map