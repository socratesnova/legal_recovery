"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Phone,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Zap,
  MessageSquare,
  Send,
  X,
  AlertOctagon,
  ShieldCheck,
  Eye,
  Download,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { demoCases, formatCurrency, formatDate } from "@/lib/seed-data";
import type { FirewallResult } from "@/lib/types";
import Link from "next/link";

const docStatusIcon = {
  complete: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  missing: <XCircle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-amber-500" />,
  expired: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

const docStatusLabel: Record<string, string> = {
  complete: "Completo",
  missing: "Faltante",
  pending: "Pendiente",
  expired: "Expirado",
};

const timelineIcons: Record<string, React.ReactNode> = {
  system: <FileText className="w-4 h-4 text-slate-400" />,
  auto: <Zap className="w-4 h-4 text-blue-400" />,
  communication: <MessageSquare className="w-4 h-4 text-emerald-400" />,
  blocked: <Shield className="w-4 h-4 text-red-400" />,
  dispute: <AlertOctagon className="w-4 h-4 text-red-500" />,
  agreement: <FileText className="w-4 h-4 text-emerald-500" />,
  payment: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const caseData = demoCases.find((c) => c.id === caseId);

  const [firewallResult, setFirewallResult] = useState<FirewallResult | null>(null);
  const [showFirewallModal, setShowFirewallModal] = useState(false);
  const [checkingChannel, setCheckingChannel] = useState<string | null>(null);
  const [firewallShake, setFirewallShake] = useState(false);

  if (!caseData) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Expediente no encontrado</p>
        <Link href="/portal/admin/cases">
          <Button variant="outline" className="mt-4">
            Volver a expedientes
          </Button>
        </Link>
      </div>
    );
  }

  async function checkFirewall(channel: string) {
    setCheckingChannel(channel);
    setFirewallResult(null);

    try {
      const res = await fetch("/api/firewall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, channel }),
      });
      const result: FirewallResult = await res.json();
      setFirewallResult(result);

      if (!result.allowed) {
        setFirewallShake(true);
        setTimeout(() => setFirewallShake(false), 600);
      }

      setShowFirewallModal(true);
    } catch {
      setFirewallResult({
        allowed: false,
        reasons: ["Error de conexión con Legal Firewall"],
        channel,
        caseId,
        timestamp: new Date().toISOString(),
      });
      setShowFirewallModal(true);
    } finally {
      setCheckingChannel(null);
    }
  }

  const scoreColor = (val: number, inverse = false) => {
    if (inverse) {
      return val <= 30
        ? "text-emerald-600 bg-emerald-50"
        : val <= 60
          ? "text-amber-600 bg-amber-50"
          : "text-red-600 bg-red-50";
    }
    return val >= 70
      ? "text-emerald-600 bg-emerald-50"
      : val >= 40
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50";
  };

  const scoreBarColor = (val: number, inverse = false) => {
    if (inverse) {
      return val <= 30
        ? "bg-emerald-500"
        : val <= 60
          ? "bg-amber-500"
          : "bg-red-500";
    }
    return val >= 70
      ? "bg-emerald-500"
      : val >= 40
        ? "bg-amber-500"
        : "bg-red-500";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/portal/admin/cases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Expedientes
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
            {caseData.debtor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {caseData.debtor.name}
              </h1>
              <Badge
                className={
                  caseData.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : caseData.status === "disputed"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                }
              >
                {caseData.status === "active"
                  ? "Activo"
                  : caseData.status === "disputed"
                    ? "En Disputa"
                    : "Restringido"}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {caseData.debtor.idNumber} · {caseData.product} ·{" "}
              {caseData.id}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(caseData.balance)}
          </p>
          <p className="text-sm text-slate-500">Saldo actual</p>
        </div>
      </div>

      {/* Data Passport Banner */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Data Passport Activo
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Fuente: <strong>{caseData.dataPassport.source}</strong> · Base
                legal: <strong>{caseData.dataPassport.legalBasis}</strong> ·
                Usos permitidos:{" "}
                <strong>{caseData.dataPassport.allowedUses.join(", ")}</strong>
                {caseData.dataPassport.restrictions.length > 0 && (
                  <span className="text-red-700">
                    {" "}
                    · Restricciones:{" "}
                    <strong>
                      {caseData.dataPassport.restrictions.join(", ")}
                    </strong>
                  </span>
                )}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-blue-700 border-blue-200 bg-white"
            >
              Confianza: {caseData.dataPassport.confidence}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Scores + Next Best Action */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Score Cards */}
        {[
          { key: "documental", label: "Documental", value: caseData.scores.documental, inv: false },
          { key: "recuperabilidad", label: "Recuperabilidad", value: caseData.scores.recoverability, inv: false },
          { key: "contactabilidad", label: "Contactabilidad", value: caseData.scores.contactability, inv: false },
          { key: "riesgo", label: "Riesgo", value: caseData.scores.risk, inv: true },
        ].map((score) => (
          <Card key={score.key}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-slate-500 mb-2">{score.label}</p>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${scoreColor(score.value, score.inv)}`}
              >
                <span className="text-xl font-bold">{score.value}</span>
              </div>
              <div className="mt-2">
                <Progress
                  value={score.value}
                  className={`h-1.5 [&>div]:${scoreBarColor(score.value, score.inv)}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Next Best Action */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Next Best Action
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {caseData.nextBestAction.offer}
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {caseData.nextBestAction.message}
            </p>
            {caseData.status === "active" && (
              <Link href={`/portal/admin/cases/${caseId}?action=agreement`}>
                <Button
                  size="sm"
                  className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Generar Acuerdo
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Channels with Legal Firewall */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              Canales de Contacto — Legal Firewall
            </CardTitle>
            <Badge variant="outline" className="text-red-600 border-red-200">
              <Shield className="w-3 h-3 mr-1" />
              Protección Activa
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {(["whatsapp", "call", "sms", "email"] as const).map((channel) => {
              const isAllowed =
                channel === "call"
                  ? caseData.debtor.phone.allowed
                  : channel === "email"
                    ? caseData.debtor.email.allowed
                    : channel === "whatsapp"
                      ? caseData.debtor.phone.allowed &&
                        caseData.debtor.phone.optIn &&
                        !caseData.dataPassport.restrictions.includes("no_whatsapp")
                      : caseData.debtor.phone.allowed &&
                        !caseData.dataPassport.restrictions.includes("no_contact");

              return (
                <div
                  key={channel}
                  className={`p-3 rounded-lg border ${
                    isAllowed
                      ? "border-slate-200 bg-white"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {channel === "whatsapp" && (
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      )}
                      {channel === "call" && (
                        <Phone className="w-4 h-4 text-blue-600" />
                      )}
                      {channel === "sms" && (
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      )}
                      {channel === "email" && (
                        <Mail className="w-4 h-4 text-amber-600" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {channel === "call" ? "Llamada" : channel === "sms" ? "SMS" : channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </span>
                    </div>
                    {isAllowed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  {channel === "call" && (
                    <p className="text-xs text-slate-500 mb-2">
                      {caseData.debtor.phone.number}
                    </p>
                  )}
                  {channel === "email" && caseData.debtor.email.address && (
                    <p className="text-xs text-slate-500 mb-2">
                      {caseData.debtor.email.address}
                    </p>
                  )}

                  <Button
                    size="sm"
                    className={`w-full ${
                      isAllowed
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    } ${firewallShake ? "animate-shake" : ""}`}
                    onClick={() => checkFirewall(channel)}
                    disabled={!!checkingChannel}
                  >
                    {checkingChannel === channel ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verificando...
                      </span>
                    ) : isAllowed ? (
                      <span className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        Enviar
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Intentar
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Documents, Timeline, Data Passport */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="passport">Data Passport</TabsTrigger>
          <TabsTrigger value="disputes">
            Disputas
            {caseData.disputes.length > 0 && (
              <Badge className="ml-1.5 bg-red-500 text-white text-[10px] h-4 px-1">
                {caseData.disputes.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                {caseData.documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {docStatusIcon[doc.status]}
                      <span className="text-sm font-medium text-slate-900">
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${
                          doc.status === "complete"
                            ? "text-emerald-700 border-emerald-200"
                            : doc.status === "missing"
                              ? "text-red-700 border-red-200"
                              : "text-amber-700 border-amber-200"
                        }`}
                      >
                        {docStatusLabel[doc.status]}
                      </Badge>
                      {doc.status === "complete" && (
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {caseData.timeline.map((event, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 flex-shrink-0">
                        {timelineIcons[event.type] || timelineIcons.system}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm ${
                              event.type === "blocked"
                                ? "font-semibold text-red-700"
                                : event.type === "dispute"
                                  ? "font-semibold text-red-700"
                                  : "text-slate-900"
                            }`}
                          >
                            {event.action}
                          </p>
                          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Por: {event.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passport">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Data Passport — Registro de Proveniencia
              </CardTitle>
              <CardDescription>
                Cada dato tiene su pasaporte legal. Se registra la fuente, base
                legal, usos permitidos y restricciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500 mb-1">Fuente del dato</p>
                    <p className="text-sm font-medium text-slate-900">
                      {caseData.dataPassport.source}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500 mb-1">Base legal</p>
                    <p className="text-sm font-medium text-slate-900">
                      {caseData.dataPassport.legalBasis}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-emerald-600 mb-2">Usos permitidos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {caseData.dataPassport.allowedUses.map((use) => (
                        <Badge
                          key={use}
                          className="bg-emerald-100 text-emerald-800 text-[10px]"
                        >
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg border ${
                      caseData.dataPassport.restrictions.length > 0
                        ? "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-xs text-red-600 mb-2">Restricciones</p>
                    {caseData.dataPassport.restrictions.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {caseData.dataPassport.restrictions.map((r) => (
                          <Badge
                            key={r}
                            className="bg-red-100 text-red-800 text-[10px]"
                          >
                            {r}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Sin restricciones
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardContent className="p-4">
              {caseData.disputes.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No hay disputas activas en este expediente
                </p>
              ) : (
                <div className="space-y-3">
                  {caseData.disputes.map((d, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-red-200 bg-red-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="w-4 h-4 text-red-500" />
                          <Badge className="bg-red-100 text-red-800">
                            {d.status === "open"
                              ? "Abierta"
                              : d.status === "resolved"
                                ? "Resuelta"
                                : "Escalada"}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {formatDate(d.openedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-red-800">{d.reason}</p>
                      <p className="text-xs text-red-600 mt-2">
                        Toda gestión de cobro pausada automáticamente hasta
                        resolución.
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legal Firewall Modal */}
      <Dialog open={showFirewallModal} onOpenChange={setShowFirewallModal}>
        <DialogContent
          className={`${
            firewallResult && !firewallResult.allowed
              ? "border-red-300 max-w-lg"
              : "border-emerald-300 max-w-lg"
          }`}
        >
          {firewallResult && (
            <>
              {firewallResult.allowed ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                      Comunicación Autorizada
                    </DialogTitle>
                    <DialogDescription>
                      El Legal Firewall verificó que esta comunicación cumple con
                      todas las regulaciones.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-800">
                      Canal: <strong>{firewallResult.channel.toUpperCase()}</strong>
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Data Passport verificado · Opt-in confirmado · Sin
                      restricciones
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFirewallModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Send className="w-4 h-4 mr-1" />
                      Enviar {firewallResult.channel.toUpperCase()}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-700">
                      <Shield className="w-5 h-5" />
                      Comunicación Bloqueada por Legal Firewall
                    </DialogTitle>
                    <DialogDescription className="text-red-600">
                      El sistema detectó violaciones a la Ley 172-13 o
                      restricciones del Data Passport.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {firewallResult.reasons.map((reason, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-red-50 border border-red-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Violación #{i + 1}
                            </p>
                            <p className="text-xs text-red-600 mt-1 leading-relaxed">
                              {reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Shield className="w-3 h-3" />
                      <span>
                        Esta acción fue registrada en el log de auditoría
                        inmutable. Timestamp: {firewallResult.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => setShowFirewallModal(false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Entendido
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}