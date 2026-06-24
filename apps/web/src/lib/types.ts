export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "gestor" | "viewer";
  institutionId: string;
  avatar?: string;
}

export interface ContactChannel {
  number?: string;
  address?: string;
  source: string | null;
  optIn: boolean;
  allowed: boolean;
  reason?: string;
}

export interface Debtor {
  name: string;
  idNumber: string;
  phone: ContactChannel;
  email: ContactChannel;
}

export interface DocumentItem {
  name: string;
  status: "complete" | "missing" | "pending" | "expired";
}

export interface DataPassport {
  source: string;
  legalBasis: string;
  allowedUses: string[];
  restrictions: string[];
  confidence?: number;
}

export interface ScoreSet {
  documental: number;
  recoverability: number;
  contactability: number;
  risk: number;
}

export interface NextBestAction {
  channel: string;
  offer: string;
  message: string;
}

export interface TimelineEvent {
  date: string;
  action: string;
  user: string;
  type: "system" | "auto" | "communication" | "blocked" | "dispute" | "agreement" | "payment";
}

export interface Dispute {
  openedAt: string;
  reason: string;
  status: "open" | "resolved" | "escalated";
}

export interface DemoCase {
  id: string;
  debtor: Debtor;
  balance: number;
  product: string;
  status: "active" | "restricted" | "blocked" | "disputed" | "closed";
  scores: ScoreSet;
  documents: DocumentItem[];
  dataPassport: DataPassport;
  nextBestAction: NextBestAction;
  timeline: TimelineEvent[];
  disputes: Dispute[];
  payments: { date: string; amount: number; status: string }[];
  institutionId: string;
}

export interface DemoCommunication {
  id: string;
  caseId: string;
  channel: string;
  direction: string;
  status: "delivered" | "blocked" | "pending" | "failed";
  content: string;
  timestamp: string;
  blockedReason?: string;
}

export interface DemoInstitution {
  id: string;
  name: string;
  logo: string;
  rules: {
    maxDiscountAuto: number;
    maxInstallments: number;
    minInstallments: number;
    channelsAllowed: string[];
    whatsappAllowed: boolean;
  };
}

export interface DemoKPIs {
  portfolioAssigned: number;
  recoveredThisMonth: number;
  netRecovery: number;
  costPerContact: number;
  casesWithAgreement: number;
  disputesResolved: number;
  firewallBlocked: number;
  activeCases: number;
  conversionRate: number;
}

export interface FirewallResult {
  allowed: boolean;
  reasons: string[];
  channel: string;
  caseId: string;
  timestamp: string;
}