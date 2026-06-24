import type {
  DemoUser,
  DemoCase,
  DemoInstitution,
  DemoCommunication,
  DemoKPIs,
} from "./types";

export const demoUsers: DemoUser[] = [
  {
    id: "user-001",
    email: "admin@legalrecovery.rd",
    name: "Lic. María Fernández",
    role: "super_admin",
    institutionId: "inst-001",
  },
  {
    id: "user-002",
    email: "gestor@legalrecovery.rd",
    name: "Carlos Ramírez",
    role: "gestor",
    institutionId: "inst-001",
  },
];

export const demoInstitution: DemoInstitution = {
  id: "inst-001",
  name: "Banco Popular Dominicano",
  logo: "/logos/banco-popular.png",
  rules: {
    maxDiscountAuto: 30,
    maxInstallments: 6,
    minInstallments: 1,
    channelsAllowed: ["portal", "email", "call", "sms"],
    whatsappAllowed: false,
  },
};

export const demoCases: DemoCase[] = [
  {
    id: "case-001",
    debtor: {
      name: "Juan Pérez",
      idNumber: "001-1234567-8",
      phone: {
        number: "+1-809-555-0100",
        source: "banco cedente",
        optIn: true,
        allowed: true,
      },
      email: {
        address: "juan.perez@demo.rd",
        source: "banco cedente",
        optIn: true,
        allowed: true,
      },
    },
    balance: 125000,
    product: "Tarjeta de crédito castigada",
    status: "active",
    scores: {
      documental: 75,
      recoverability: 85,
      contactability: 90,
      risk: 40,
    },
    documents: [
      { name: "Contrato", status: "complete" },
      { name: "Cesión de cartera", status: "complete" },
      { name: "Estado de cuenta", status: "complete" },
      { name: "Pagaré", status: "missing" },
    ],
    dataPassport: {
      source: "banco cedente",
      legalBasis: "Mandato de gestión cobranza judicial",
      allowedUses: ["contact", "analysis", "agreement"],
      restrictions: [],
      confidence: 95,
    },
    nextBestAction: {
      channel: "call",
      offer: "3 cuotas con 20% descuento",
      message:
        "Alta contactabilidad y recuperabilidad. Ofrecer acuerdo de 3 cuotas con 20% descuento. Canal preferido: llamada telefónica. Evitar SMS (baja conversión en este perfil).",
    },
    timeline: [
      { date: "2026-06-01", action: "Cartera cargada al sistema", user: "Sistema", type: "system" },
      { date: "2026-06-02", action: "Validación de documentos completada", user: "Sistema", type: "auto" },
      { date: "2026-06-02", action: "Teléfono validado (fuente: banco cedente)", user: "Sistema", type: "auto" },
      { date: "2026-06-03", action: "Score de recuperabilidad calculado: 85/100", user: "AI Engine", type: "auto" },
      { date: "2026-06-05", action: "Email de recordatorio enviado", user: "Sistema", type: "communication" },
      { date: "2026-06-08", action: "Next Best Action generada", user: "AI Engine", type: "auto" },
    ],
    disputes: [],
    payments: [],
    institutionId: "inst-001",
  },
  {
    id: "case-002",
    debtor: {
      name: "María García",
      idNumber: "002-7654321-0",
      phone: {
        number: "+1-809-555-0200",
        source: "JCE",
        optIn: false,
        allowed: false,
        reason:
          "Dato obtenido de JCE sin permiso de contacto comercial. Base legal: consulta administrativa (Ley 659). Prohibido usar para gestión de cobro.",
      },
      email: {
        address: null as unknown as string,
        source: null,
        optIn: false,
        allowed: false,
      },
    },
    balance: 89000,
    product: "Préstamo personal",
    status: "active",
    scores: {
      documental: 60,
      recoverability: 45,
      contactability: 20,
      risk: 70,
    },
    documents: [
      { name: "Contrato", status: "complete" },
      { name: "Cesión de cartera", status: "pending" },
      { name: "Pagaré", status: "missing" },
    ],
    dataPassport: {
      source: "JCE - Consulta administrativa",
      legalBasis: "Ley 659 sobre actos del estado civil",
      allowedUses: ["validation"],
      restrictions: ["no_contact", "no_whatsapp", "no_sms", "no_email"],
      confidence: 60,
    },
    nextBestAction: {
      channel: "portal",
      offer: "Requiere validación documental",
      message:
        "Contactabilidad bloqueada por Legal Firewall. Solo contacto vía portal (si el deudor accede voluntariamente). Priorizar obtención de fuentes autorizadas de contacto.",
    },
    timeline: [
      { date: "2026-06-01", action: "Cartera cargada al sistema", user: "Sistema", type: "system" },
      { date: "2026-06-02", action: "Validación de documentos: 2 faltantes", user: "Sistema", type: "auto" },
      {
        date: "2026-06-02",
        action: "⚠️ Legal Firewall: teléfono bloqueado (fuente JCE)",
        user: "Legal Firewall",
        type: "blocked",
      },
      {
        date: "2026-06-02",
        action: "⚠️ Legal Firewall: email no disponible",
        user: "Legal Firewall",
        type: "blocked",
      },
      { date: "2026-06-03", action: "Score de contactabilidad: 20/100 (bloqueado)", user: "AI Engine", type: "auto" },
    ],
    disputes: [],
    payments: [],
    institutionId: "inst-001",
  },
  {
    id: "case-003",
    debtor: {
      name: "Pedro Martínez",
      idNumber: "003-1111111-2",
      phone: {
        number: "+1-809-555-0300",
        source: "tercero (cónyuge)",
        optIn: false,
        allowed: false,
        reason:
          "Contacto pertenece a tercero no autorizado (cónyuge). Prohibido por Ley 172-13 Art. 17: datos de terceros requieren consentimiento expreso.",
      },
      email: {
        address: null as unknown as string,
        source: null,
        optIn: false,
        allowed: false,
      },
    },
    balance: 250000,
    product: "Tarjeta de crédito castigada",
    status: "disputed",
    scores: {
      documental: 90,
      recoverability: 75,
      contactability: 0,
      risk: 95,
    },
    documents: [
      { name: "Contrato", status: "complete" },
      { name: "Cesión de cartera", status: "complete" },
      { name: "Estado de cuenta", status: "complete" },
      { name: "Pagaré", status: "complete" },
    ],
    dataPassport: {
      source: "banco cedente",
      legalBasis: "Mandato de gestión cobranza judicial",
      allowedUses: ["analysis"],
      restrictions: ["no_contact", "case_disputed", "no_whatsapp"],
      confidence: 90,
    },
    nextBestAction: {
      channel: "none",
      offer: "Caso en disputa - pausar gestión",
      message:
        "CASO EN DISPUTA. Toda gestión de cobro pausada automáticamente. Resolución de disputa requiere revisión manual antes de reanudar contacto.",
    },
    timeline: [
      { date: "2026-06-01", action: "Cartera cargada al sistema", user: "Sistema", type: "system" },
      { date: "2026-06-01", action: "Documentos validados (4/4 completos)", user: "Sistema", type: "auto" },
      { date: "2026-06-02", action: "Score de riesgo alto: 95/100", user: "AI Engine", type: "auto" },
      {
        date: "2026-06-09",
        action: "🔴 Disputa abierta por el deudor: 'Deuda ya saldada'",
        user: "Pedro Martínez",
        type: "dispute",
      },
      {
        date: "2026-06-09",
        action: "🔴 Campaña pausada automáticamente (caso en disputa)",
        user: "Legal Firewall",
        type: "blocked",
      },
      {
        date: "2026-06-09",
        action: "⚠️ Legal Firewall: contacto de tercero bloqueado",
        user: "Legal Firewall",
        type: "blocked",
      },
    ],
    disputes: [
      {
        openedAt: "2026-06-09",
        reason: "Deuda ya saldada según deudor. Presentó comprobante de pago.",
        status: "open",
      },
    ],
    payments: [],
    institutionId: "inst-001",
  },
];

export const demoCommunications: DemoCommunication[] = [
  {
    id: "comm-001",
    caseId: "case-001",
    channel: "email",
    direction: "outbound",
    status: "delivered",
    content: "Recordatorio de saldo pendiente - Ref: case-001",
    timestamp: "2026-06-05T10:30:00Z",
  },
  {
    id: "comm-002",
    caseId: "case-001",
    channel: "call",
    direction: "outbound",
    status: "delivered",
    content: "Llamada de seguimiento - contacto exitoso",
    timestamp: "2026-06-07T14:00:00Z",
  },
  {
    id: "comm-003",
    caseId: "case-002",
    channel: "whatsapp",
    direction: "outbound",
    status: "blocked",
    content: "BLOQUEADO: Dato JCE sin autorización de contacto",
    timestamp: "2026-06-06T14:00:00Z",
    blockedReason:
      "Legal Firewall: Teléfono obtenido de JCE sin permiso de contacto comercial. Prohibido por Ley 659.",
  },
  {
    id: "comm-004",
    caseId: "case-002",
    channel: "sms",
    direction: "outbound",
    status: "blocked",
    content: "BLOQUEADO: SMS a dato JCE no autorizado",
    timestamp: "2026-06-06T14:01:00Z",
    blockedReason:
      "Legal Firewall: Dato de JCE solo permite validación, no contacto.",
  },
  {
    id: "comm-005",
    caseId: "case-003",
    channel: "whatsapp",
    direction: "outbound",
    status: "blocked",
    content: "BLOQUEADO: Caso en disputa + tercero no autorizado",
    timestamp: "2026-06-09T09:00:00Z",
    blockedReason:
      "Legal Firewall: 1) Caso en disputa - toda gestión pausada. 2) Teléfono pertenece a tercero (cónyuge) sin consentimiento. Prohibido por Ley 172-13.",
  },
  {
    id: "comm-006",
    caseId: "case-003",
    channel: "email",
    direction: "outbound",
    status: "blocked",
    content: "BLOQUEADO: Caso en disputa",
    timestamp: "2026-06-09T09:01:00Z",
    blockedReason:
      "Legal Firewall: Caso con disputa activa. Toda comunicación pausada hasta resolución.",
  },
];

export const demoKPIs: DemoKPIs = {
  portfolioAssigned: 50000000,
  recoveredThisMonth: 8500000,
  netRecovery: 6200000,
  costPerContact: 45,
  casesWithAgreement: 45,
  disputesResolved: 3,
  firewallBlocked: 12,
  activeCases: 1200,
  conversionRate: 18.5,
};

export const demoAuditLog = [
  { id: "audit-001", timestamp: "2026-06-09T14:30:00Z", user: "Lic. María Fernández", action: "Consultó expediente case-001", result: "allowed", ip: "192.168.1.100" },
  { id: "audit-002", timestamp: "2026-06-09T14:31:00Z", user: "Carlos Ramírez", action: "Intentó enviar WhatsApp a case-002", result: "blocked", ip: "192.168.1.101", detail: "Legal Firewall: fuente JCE sin autorización" },
  { id: "audit-003", timestamp: "2026-06-09T14:32:00Z", user: "Carlos Ramírez", action: "Intentó enviar WhatsApp a case-003", result: "blocked", ip: "192.168.1.101", detail: "Legal Firewall: caso en disputa + tercero no autorizado" },
  { id: "audit-004", timestamp: "2026-06-09T14:33:00Z", user: "Sistema", action: "Disputa registrada en case-003", result: "auto-logged", ip: "10.166.166.60" },
  { id: "audit-005", timestamp: "2026-06-09T14:35:00Z", user: "Lic. María Fernández", action: "Generó acuerdo para case-001", result: "allowed", ip: "192.168.1.100" },
  { id: "audit-006", timestamp: "2026-06-09T14:40:00Z", user: "Sistema", action: "Legal Firewall bloqueó 2 comunicaciones", result: "blocked", ip: "10.166.166.60" },
  { id: "audit-007", timestamp: "2026-06-09T15:00:00Z", user: "Pedro Martínez", action: "Abrió disputa desde portal deudor", result: "allowed", ip: "186.44.xxx.xxx" },
  { id: "audit-008", timestamp: "2026-06-09T15:01:00Z", user: "Sistema", action: "Campaña case-003 pausada automáticamente", result: "auto-blocked", ip: "10.166.166.60" },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}