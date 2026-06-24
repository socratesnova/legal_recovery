import { PrismaService } from "../prisma.service";
import { AuthenticatedUser } from "../decorators/current-user.decorator";
export type FirewallPurpose = "contact" | "view" | "download" | "export" | "process";
export interface FirewallRequest {
    caseId: string;
    purpose: FirewallPurpose;
    channel?: string;
    entityType?: string;
    entityId?: string;
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
export declare class LegalFirewallService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canUseData(actor: AuthenticatedUser, request: FirewallRequest): Promise<FirewallResult>;
    assertCanUse(actor: AuthenticatedUser, request: FirewallRequest): Promise<FirewallResult>;
    private evaluateFieldAccess;
    private evaluateContactChannel;
    private findRestriction;
    private findConsent;
    private hasAuthorizedContact;
    private deny;
}
