import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthenticatedUser } from "../decorators/current-user.decorator";
import {
  CaseStatus,
  DisputeStatus,
  PassportStatus,
  ConsentType,
  ContactChannel,
  type Case,
  type DataPassport,
  type DataRestriction,
  type Consent,
  type Contact,
  type Dispute,
} from "@prisma/client";

export type FirewallPurpose =
  | "contact"
  | "view"
  | "download"
  | "export"
  | "process";

export interface FirewallRequest {
  caseId: string;
  purpose: FirewallPurpose;
  /** Canal por el que se intenta contactar o gestionar. */
  channel?: string;
  /** Entidad afectada (debtor/contact/document) para passports/restrictions. */
  entityType?: string;
  entityId?: string;
  /** Campo específico cuyo passport se evalúa (para view/download). */
  fieldName?: string;
}

export interface FirewallResult {
  allowed: boolean;
  reasons: string[];
  caseId: string;
  channel?: string;
  purpose: FirewallPurpose;
  timestamp: string;
}

const ACTIVE_DISPUTE_STATUSES: DisputeStatus[] = [
  "OPEN",
  "UNDER_REVIEW",
  "ESCALATED",
];

const BLOCKING_PASSPORT_STATUSES: PassportStatus[] = ["BLOCKED", "EXPIRED"];

/**
 * Backend implementation of the Legal Firewall. Mirrors the rules enforced on
 * the frontend by `apps/web/src/lib/legal-firewall.ts`, but resolved against the
 * real Prisma data (Case, Contact, Consent, DataPassport, DataRestriction).
 *
 * Every sensitive action (contact, data access, download, export) MUST go
 * through `canUseData` (or `assertCanUse`) before proceeding.
 */
@Injectable()
export class LegalFirewallService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluate whether `actor` may perform `purpose` on the case/field/channel.
   * Never throws on policy denial — returns `{ allowed: false, reasons }` so
   * callers can decide (audit + reject, or surface to user). Use `assertCanUse`
   * when you want a denial to become an HTTP 403.
   */
  async canUseData(
    actor: AuthenticatedUser,
    request: FirewallRequest,
  ): Promise<FirewallResult> {
    const { caseId, purpose, channel, entityType, entityId, fieldName } =
      request;
    const reasons: string[] = [];
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

    // 1. Case-level blocks: disputed or legally blocked status.
    if (caseData.status === CaseStatus.DISPUTED) {
      reasons.push(
        "Case is in DISPUTED status. All collection and communication is paused until resolution.",
      );
    }
    if (caseData.status === CaseStatus.BLOCKED) {
      reasons.push("Case is BLOCKED by legal or regulatory order.");
    }

    // 2. Active disputes (regardless of case status) pause all management.
    const activeDisputes = caseData.disputes.filter((d) =>
      ACTIVE_DISPUTE_STATUSES.includes(d.status),
    );
    if (activeDisputes.length > 0) {
      reasons.push(
        `Case has ${activeDisputes.length} active dispute(s). Management is paused until resolution.`,
      );
    }

    // 3. Case communication passport: prohibitedUses (e.g. no_whatsapp, no_contact).
    const caseCommPassport = caseData.dataPassports.find(
      (p) => p.fieldName === "communication",
    );
    const caseProhibited = caseCommPassport?.prohibitedUses ?? [];

    // 4. Per-field restrictions / passports for view/download/export.
    if (
      (purpose === "view" || purpose === "download" || purpose === "export") &&
      entityId &&
      fieldName
    ) {
      reasons.push(
        ...(await this.evaluateFieldAccess(
          actor,
          caseData,
          entityType ?? "debtor",
          entityId,
          fieldName,
        )),
      );
    }

    // 5. Contact-channel rules.
    if (purpose === "contact" && normalizedChannel) {
      reasons.push(
        ...(await this.evaluateContactChannel(
          caseData,
          normalizedChannel,
          caseProhibited,
        )),
      );
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

  /**
   * Evaluate and throw ForbiddenException if the action is not allowed.
   * Use in controllers/services where a denial must abort the request.
   */
  async assertCanUse(
    actor: AuthenticatedUser,
    request: FirewallRequest,
  ): Promise<FirewallResult> {
    const result = await this.canUseData(actor, request);
    if (!result.allowed) {
      throw new ForbiddenException(
        `Legal Firewall blocked this action: ${result.reasons.join(" | ")}`,
      );
    }
    return result;
  }

  private async evaluateFieldAccess(
    actor: AuthenticatedUser,
    caseData: Case,
    entityType: string,
    entityId: string,
    fieldName: string,
  ): Promise<string[]> {
    const reasons: string[] = [];

    const passport = await this.prisma.dataPassport.findFirst({
      where: { caseId: caseData.id, entityType, entityId, fieldName },
      orderBy: { capturedAt: "desc" },
    });

    if (!passport) {
      reasons.push(
        `No Data Passport found for ${entityType}.${fieldName}. Data without provenance cannot be used.`,
      );
      return reasons;
    }

    if (BLOCKING_PASSPORT_STATUSES.includes(passport.status)) {
      reasons.push(
        `Data Passport for ${entityType}.${fieldName} is ${passport.status}.`,
      );
    }

    if (
      passport.expirationDate &&
      passport.expirationDate < new Date() &&
      passport.status !== PassportStatus.EXPIRED
    ) {
      reasons.push(
        `Data Passport for ${entityType}.${fieldName} expired on ${passport.expirationDate.toISOString()}.`,
      );
    }

    // Visibility: if roles are declared, the actor's role must be included.
    if (
      passport.visibilityRoles.length > 0 &&
      !passport.visibilityRoles.includes(actor.role)
    ) {
      reasons.push(
        `Your role (${actor.role}) is not authorized to access ${entityType}.${fieldName}.`,
      );
    }

    // Prohibited uses apply to the requested action.
    if (passport.prohibitedUses.includes("view")) {
      reasons.push(
        `Viewing ${entityType}.${fieldName} is explicitly prohibited.`,
      );
    }

    // Restrictions table (applied by compliance/legal).
    const restrictions = await this.prisma.dataRestriction.findMany({
      where: { entityType, entityId, fieldName },
    });
    for (const r of restrictions) {
      if (r.restrictionType === "no_access") {
        reasons.push(
          `Access to ${entityType}.${fieldName} is restricted: ${r.reason ?? "no reason provided"}.`,
        );
      }
      if (r.expiresAt && r.expiresAt < new Date()) {
        continue; // expired restriction no longer applies
      }
    }

    return reasons;
  }

  private async evaluateContactChannel(
    caseData: Case & {
      disputes: Dispute[];
      dataPassports: DataPassport[];
    },
    channel: string,
    caseProhibited: string[],
  ): Promise<string[]> {
    const reasons: string[] = [];
    const debtorId = caseData.debtorId;

    // WhatsApp: double opt-in + no explicit no_whatsapp restriction.
    if (channel === "WHATSAPP" || channel === ContactChannel.WHATSAPP) {
      if (caseProhibited.includes("no_whatsapp")) {
        reasons.push(
          "WhatsApp is restricted for this case by Data Passport policy (no_whatsapp).",
        );
      }
      const restriction = await this.findRestriction(
        caseData.id,
        "case",
        "communication",
        "no_whatsapp",
      );
      if (restriction) {
        reasons.push(
          "WhatsApp is restricted for this case by an explicit Data Restriction.",
        );
      }
      const consent = await this.findConsent(debtorId, ConsentType.WHATSAPP);
      if (!consent || !consent.granted) {
        reasons.push(
          "WhatsApp requires explicit debtor opt-in. No active WhatsApp consent found.",
        );
      }
      return reasons;
    }

    // SMS / PHONE (call): no_contact restriction + contact authorization.
    if (channel === "SMS" || channel === "PHONE") {
      if (caseProhibited.includes("no_contact")) {
        reasons.push(
          `Contact via ${channel} is blocked by Data Passport policy (no_contact).`,
        );
      }
      const restriction = await this.findRestriction(
        caseData.id,
        "case",
        "communication",
        "no_contact",
      );
      const hasPhoneContact = await this.hasAuthorizedContact(
        debtorId,
        ContactChannel.PHONE,
      );
      if (restriction && !hasPhoneContact) {
        reasons.push(
          `Contact via ${channel} is blocked by Data Restriction (no_contact) and no authorized phone contact exists.`,
        );
      }
      if (!hasPhoneContact && channel === "PHONE") {
        reasons.push("No authorized phone contact exists for this debtor.");
      }
      return reasons;
    }

    // EMAIL: requires an authorized email contact or granted email consent.
    if (channel === "EMAIL") {
      const hasEmailContact = await this.hasAuthorizedContact(
        debtorId,
        ContactChannel.EMAIL,
      );
      const emailConsent = await this.findConsent(debtorId, ConsentType.EMAIL);
      if (!hasEmailContact && !(emailConsent && emailConsent.granted)) {
        reasons.push(
          "No authorized email contact or active email consent exists for this debtor.",
        );
      }
      return reasons;
    }

    // Unknown channel: allow but log no reason. Callers should validate upstream.
    return reasons;
  }

  private async findRestriction(
    entityId: string,
    entityType: string,
    fieldName: string,
    restrictionType: string,
  ): Promise<DataRestriction | null> {
    const restriction = await this.prisma.dataRestriction.findFirst({
      where: { entityType, entityId, fieldName, restrictionType },
    });
    if (!restriction) return null;
    if (restriction.expiresAt && restriction.expiresAt < new Date()) {
      return null; // expired restriction no longer applies
    }
    return restriction;
  }

  private async findConsent(
    debtorId: string,
    type: ConsentType,
  ): Promise<Consent | null> {
    const consents = await this.prisma.consent.findMany({
      where: { debtorId, type },
      orderBy: { createdAt: "desc" },
    });
    // A consent is "active" if the latest record is granted and not revoked.
    const latest = consents[0];
    if (!latest) return null;
    if (!latest.granted) return null;
    if (latest.revokedAt && latest.revokedAt < new Date()) return null;
    return latest;
  }

  private async hasAuthorizedContact(
    debtorId: string,
    channel: ContactChannel,
  ): Promise<boolean> {
    const contact: Contact | null = await this.prisma.contact.findFirst({
      where: { debtorId, channel, deletedAt: null, optIn: true },
    });
    return contact !== null;
  }

  private deny(
    caseId: string,
    purpose: FirewallPurpose,
    channel: string | undefined,
    reasons: string[],
  ): FirewallResult {
    return {
      allowed: false,
      reasons,
      caseId,
      channel,
      purpose,
      timestamp: new Date().toISOString(),
    };
  }
}
