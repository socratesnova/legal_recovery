import type { DemoCase, FirewallResult } from "./types";
import { demoCases } from "./seed-data";

export function canUseData(
  userRole: string,
  caseData: DemoCase,
  purpose: string,
  channel: string
): FirewallResult {
  const reasons: string[] = [];

  if (caseData.status === "disputed") {
    reasons.push(
      `Caso en disputa activa. Toda gestión de cobro y comunicación está pausada hasta resolución.`
    );
  }

  if (caseData.status === "blocked") {
    reasons.push(`Caso bloqueado por orden legal o regulatoria.`);
  }

  const contactChannel =
    channel === "whatsapp" || channel === "call" || channel === "sms"
      ? caseData.debtor.phone
      : channel === "email"
        ? caseData.debtor.email
        : null;

  if (contactChannel && !contactChannel.allowed) {
    reasons.push(
      `Canal ${channel.toUpperCase()} bloqueado: ${contactChannel.reason || "Fuente de dato sin autorización de contacto."}`
    );
  }

  if (channel === "whatsapp") {
    if (caseData.dataPassport.restrictions.includes("no_whatsapp")) {
      reasons.push(
        `WhatsApp está restringido para este caso por política de Data Passport: ${caseData.dataPassport.restrictions.filter((r) => r.includes("whatsapp")).join(", ")}.`
      );
    }
    if (!caseData.debtor.phone.optIn) {
      reasons.push(
        `WhatsApp requiere opt-in explícito del deudor. Sin opt-in registrado.`
      );
    }
  }

  if (channel === "sms" || channel === "call") {
    if (
      caseData.dataPassport.restrictions.includes("no_contact") &&
      !caseData.debtor.phone.allowed
    ) {
      reasons.push(
        `Contacto vía ${channel} bloqueado por restricción de Data Passport: no_contact.`
      );
    }
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    channel,
    caseId: caseData.id,
    timestamp: new Date().toISOString(),
  };
}

export function checkFirewall(caseId: string, channel: string): FirewallResult {
  const caseData = demoCases.find((c) => c.id === caseId);
  if (!caseData) {
    return {
      allowed: false,
      reasons: ["Caso no encontrado."],
      channel,
      caseId,
      timestamp: new Date().toISOString(),
    };
  }
  return canUseData("gestor", caseData, "contact", channel);
}