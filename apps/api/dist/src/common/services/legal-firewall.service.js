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
exports.LegalFirewallService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const ACTIVE_DISPUTE_STATUSES = [
    "OPEN",
    "UNDER_REVIEW",
    "ESCALATED",
];
const BLOCKING_PASSPORT_STATUSES = ["BLOCKED", "EXPIRED"];
let LegalFirewallService = class LegalFirewallService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canUseData(actor, request) {
        const { caseId, purpose, channel, entityType, entityId, fieldName } = request;
        const reasons = [];
        const normalizedChannel = channel?.toUpperCase();
        const caseData = await this.prisma.case.findUnique({
            where: { id: caseId },
            include: {
                disputes: { orderBy: { openedAt: "desc" } },
                dataPassports: { where: { entityType: "case", entityId: caseId } },
            },
        });
        if (!caseData) {
            return this.deny(caseId, purpose, normalizedChannel, ["Case not found."]);
        }
        if (caseData.status === client_1.CaseStatus.DISPUTED) {
            reasons.push("Case is in DISPUTED status. All collection and communication is paused until resolution.");
        }
        if (caseData.status === client_1.CaseStatus.BLOCKED) {
            reasons.push("Case is BLOCKED by legal or regulatory order.");
        }
        const activeDisputes = caseData.disputes.filter((d) => ACTIVE_DISPUTE_STATUSES.includes(d.status));
        if (activeDisputes.length > 0) {
            reasons.push(`Case has ${activeDisputes.length} active dispute(s). Management is paused until resolution.`);
        }
        const caseCommPassport = caseData.dataPassports.find((p) => p.fieldName === "communication");
        const caseProhibited = caseCommPassport?.prohibitedUses ?? [];
        if ((purpose === "view" || purpose === "download" || purpose === "export") &&
            entityId &&
            fieldName) {
            reasons.push(...(await this.evaluateFieldAccess(actor, caseData, entityType ?? "debtor", entityId, fieldName)));
        }
        if (purpose === "contact" && normalizedChannel) {
            reasons.push(...(await this.evaluateContactChannel(caseData, normalizedChannel, caseProhibited)));
        }
        return {
            allowed: reasons.length === 0,
            reasons,
            caseId,
            channel: normalizedChannel,
            purpose,
            timestamp: new Date().toISOString(),
        };
    }
    async assertCanUse(actor, request) {
        const result = await this.canUseData(actor, request);
        if (!result.allowed) {
            throw new common_1.ForbiddenException(`Legal Firewall blocked this action: ${result.reasons.join(" | ")}`);
        }
        return result;
    }
    async evaluateFieldAccess(actor, caseData, entityType, entityId, fieldName) {
        const reasons = [];
        const passport = await this.prisma.dataPassport.findFirst({
            where: { caseId: caseData.id, entityType, entityId, fieldName },
            orderBy: { capturedAt: "desc" },
        });
        if (!passport) {
            reasons.push(`No Data Passport found for ${entityType}.${fieldName}. Data without provenance cannot be used.`);
            return reasons;
        }
        if (BLOCKING_PASSPORT_STATUSES.includes(passport.status)) {
            reasons.push(`Data Passport for ${entityType}.${fieldName} is ${passport.status}.`);
        }
        if (passport.expirationDate &&
            passport.expirationDate < new Date() &&
            passport.status !== client_1.PassportStatus.EXPIRED) {
            reasons.push(`Data Passport for ${entityType}.${fieldName} expired on ${passport.expirationDate.toISOString()}.`);
        }
        if (passport.visibilityRoles.length > 0 &&
            !passport.visibilityRoles.includes(actor.role)) {
            reasons.push(`Your role (${actor.role}) is not authorized to access ${entityType}.${fieldName}.`);
        }
        if (passport.prohibitedUses.includes("view")) {
            reasons.push(`Viewing ${entityType}.${fieldName} is explicitly prohibited.`);
        }
        const restrictions = await this.prisma.dataRestriction.findMany({
            where: { entityType, entityId, fieldName },
        });
        for (const r of restrictions) {
            if (r.restrictionType === "no_access") {
                reasons.push(`Access to ${entityType}.${fieldName} is restricted: ${r.reason ?? "no reason provided"}.`);
            }
            if (r.expiresAt && r.expiresAt < new Date()) {
                continue;
            }
        }
        return reasons;
    }
    async evaluateContactChannel(caseData, channel, caseProhibited) {
        const reasons = [];
        const debtorId = caseData.debtorId;
        if (channel === "WHATSAPP" || channel === client_1.ContactChannel.WHATSAPP) {
            if (caseProhibited.includes("no_whatsapp")) {
                reasons.push("WhatsApp is restricted for this case by Data Passport policy (no_whatsapp).");
            }
            const restriction = await this.findRestriction(caseData.id, "case", "communication", "no_whatsapp");
            if (restriction) {
                reasons.push("WhatsApp is restricted for this case by an explicit Data Restriction.");
            }
            const consent = await this.findConsent(debtorId, client_1.ConsentType.WHATSAPP);
            if (!consent || !consent.granted) {
                reasons.push("WhatsApp requires explicit debtor opt-in. No active WhatsApp consent found.");
            }
            return reasons;
        }
        if (channel === "SMS" || channel === "PHONE") {
            if (caseProhibited.includes("no_contact")) {
                reasons.push(`Contact via ${channel} is blocked by Data Passport policy (no_contact).`);
            }
            const restriction = await this.findRestriction(caseData.id, "case", "communication", "no_contact");
            const hasPhoneContact = await this.hasAuthorizedContact(debtorId, client_1.ContactChannel.PHONE);
            if (restriction && !hasPhoneContact) {
                reasons.push(`Contact via ${channel} is blocked by Data Restriction (no_contact) and no authorized phone contact exists.`);
            }
            if (!hasPhoneContact && channel === "PHONE") {
                reasons.push("No authorized phone contact exists for this debtor.");
            }
            return reasons;
        }
        if (channel === "EMAIL") {
            const hasEmailContact = await this.hasAuthorizedContact(debtorId, client_1.ContactChannel.EMAIL);
            const emailConsent = await this.findConsent(debtorId, client_1.ConsentType.EMAIL);
            if (!hasEmailContact && !(emailConsent && emailConsent.granted)) {
                reasons.push("No authorized email contact or active email consent exists for this debtor.");
            }
            return reasons;
        }
        return reasons;
    }
    async findRestriction(entityId, entityType, fieldName, restrictionType) {
        const restriction = await this.prisma.dataRestriction.findFirst({
            where: { entityType, entityId, fieldName, restrictionType },
        });
        if (!restriction)
            return null;
        if (restriction.expiresAt && restriction.expiresAt < new Date()) {
            return null;
        }
        return restriction;
    }
    async findConsent(debtorId, type) {
        const consents = await this.prisma.consent.findMany({
            where: { debtorId, type },
            orderBy: { createdAt: "desc" },
        });
        const latest = consents[0];
        if (!latest)
            return null;
        if (!latest.granted)
            return null;
        if (latest.revokedAt && latest.revokedAt < new Date())
            return null;
        return latest;
    }
    async hasAuthorizedContact(debtorId, channel) {
        const contact = await this.prisma.contact.findFirst({
            where: { debtorId, channel, deletedAt: null, optIn: true },
        });
        return contact !== null;
    }
    deny(caseId, purpose, channel, reasons) {
        return {
            allowed: false,
            reasons,
            caseId,
            channel,
            purpose,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.LegalFirewallService = LegalFirewallService;
exports.LegalFirewallService = LegalFirewallService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LegalFirewallService);
//# sourceMappingURL=legal-firewall.service.js.map