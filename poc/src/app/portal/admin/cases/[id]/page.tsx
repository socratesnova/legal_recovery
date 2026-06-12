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
  Activity,
  BarChart3,
  ShieldAlert,
  TrendingUp,
  Wallet,
  Target,
  ChevronRight,
  Gavel,
  Fingerprint,
  Scale,
  BadgeCheck,
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
  missing: <XCircle className="w-4 h-4 text-amber-500" />,
  pending: <Clock className="w-4 h-4 text-blue-500" />,
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
  blocked: <Shield className="w-4 h-4 text-emerald-600" />,
  dispute: <AlertOctagon className="w-4 h-4 text-amber-500" />,
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
  const [activeTab, setActiveTab] = useState("overview");

  if (!caseData) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Expediente no encontrado</p>
        <p className="text-sm text-slate-400 mt-1">Verifica el ID del caso</p>
        <Link href="/portal/admin/cases">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
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
      return val <= 30 ? "text-emerald-600 bg-emerald-50" : val <= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
    }
    return val >= 70 ? "text-emerald-600 bg-emerald-50" : val >= 40 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  };

  const scoreBarColor = (val: number, inverse = false) => {
    if (inverse) {
      return val <= 30 ? "bg-emerald-500" : val <= 60 ? "bg-amber-500" : "bg-red-500";
    }
    return val >= 70 ? "bg-emerald-500" : val >= 40 ? "bg-amber-500" : "bg-red-500";
  };

  const scoreLabel = (val: number, inverse = false) => {
    if (inverse) {
      return val <= 30 ? "Bajo" : val <= 60 ? "Medio" : "Alto";
    }
    return val >= 70 ? "Alto" : val >= 40 ? "Medio" : "Bajo";
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
            {caseData.debtor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{caseData.debtor.name}</h1>
              <Badge
                className={
                  caseData.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  caseData.status === "disputed" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-slate-50 text-slate-700 border-slate-200"
                }
              >
                {caseData.status === "active" ? "Activo" : caseData.status === "disputed" ? "En Disputa" : "Restringido"}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Fingerprint className="w-3 h-3 mr-1" />
                {caseData.id}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {caseData.debtor.idNumber} · {caseData.product} ·
              <span className="ml-1">
                <Badge variant="outline" className="text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Data Passport: {caseData.dataPassport.confidence}% confianza
                </Badge>
              </span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(caseData.balance)}</p>
          <p className="text-sm text-slate-500">Saldo actual</p>
          <div className="flex items-center gap-2 mt-1 justify-end">
            <Badge variant="outline" className="text-[10px] bg-slate-50">
              <Wallet className="w-3 h-3 mr-1" />
              {caseData.payments.length} pagos
            </Badge>
          </div>
        </div>
      </div>

      {/* Data Passport Banner */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-blue-900">Data Passport Activo — Proveniencia de Datos</p>
                <Badge variant="outline" className="text-blue-700 border-blue-200 bg-white">
                  Confianza: {caseData.dataPassport.confidence}%
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-700">
                <span><strong>Fuente:</strong> {caseData.dataPassport.source}</span>
                <span><strong>Base legal:</strong> {caseData.dataPassport.legalBasis}</span>
                <span><strong>Usos permitidos:</strong> {caseData.dataPassport.allowedUses.join(", ")}</span>
                {caseData.dataPassport.restrictions.length > 0 && (
                  <span className="text-red-600">
                    <strong>Restricciones:</strong> {caseData.dataPassport.restrictions.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scores + Next Best Action */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { key: "documental", label: "Documental", value: caseData.scores.documental, inv: false },
          { key: "recuperabilidad", label: "Recuperabilidad", value: caseData.scores.recoverability, inv: false },
          { key: "contactabilidad", label: "Contactabilidad", value: caseData.scores.contactability, inv: false },
          { key: "riesgo", label: "Riesgo", value: caseData.scores.risk, inv: true },
        ].map((score) => (
          <Card key={score.key} className="relative overflow-hidden">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">{score.label}</p>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${scoreColor(score.value, score.inv)} shadow-sm`}>
                <span className="text-xl font-bold">{score.value}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{scoreLabel(score.value, score.inv)}</p>
              <div className="mt-2">
                <Progress value={score.value} className={`h-1.5 &[div]:${scoreBarColor(score.value, score.inv)}`} />
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Next Best Action</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{caseData.nextBestAction.offer}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{caseData.nextBestAction.message}</p>
            {caseData.status === "active" && (
              <Link href={`/portal/admin/cases/${caseId}?action=agreement`}>
                <Button size="sm" className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <FileText className="w-4 h-4 mr-1" />
                  Generar Acuerdo
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Channels with Legal Firewall */}
      <Card className="border-t-4 border-t-emerald-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Legal Firewall — Canales de Contacto Verificados
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Shield className="w-3 h-3 mr-1" />
              Protección Activa
            </Badge>
          </div>
          <CardDescription>
            Cada canal se verifica contra Data Passport, Ley 172-13 y políticas de contacto antes de permitir envío
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(["whatsapp", "call", "sms", "email"] as const).map((channel) => {
              const isAllowed =
                channel === "call" ? caseData.debtor.phone.allowed :
                channel === "email" ? caseData.debtor.email.allowed :
                channel === "whatsapp" ? caseData.debtor.phone.allowed && caseData.debtor.phone.optIn && !caseData.dataPassport.restrictions.includes("no_whatsapp") :
                caseData.debtor.phone.allowed && !caseData.dataPassport.restrictions.includes("no_contact");

              return (
                <div
                  key={channel}
                  className={`p-4 rounded-xl border transition-all ${
                    isAllowed
                      ? "border-slate-200 bg-white hover:shadow-md hover:border-emerald-200"
                      : "border-emerald-200 bg-emerald-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAllowed ? "bg-slate-100" : "bg-emerald-100"}`}>
                        {channel === "whatsapp" && <MessageSquare className="w-4 h-4 text-green-600" />}
                        {channel === "call" && <Phone className="w-4 h-4 text-blue-600" />}
                        {channel === "sms" && <MessageSquare className="w-4 h-4 text-purple-600" />}
                        {channel === "email" && <Mail className="w-4 h-4 text-amber-600" />}
                      </div>
                      <span className="text-sm font-bold">
                        {channel === "call" ? "Llamada" : channel === "sms" ? "SMS" : channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </span>
                    </div>
                    {isAllowed ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        <BadgeCheck className="w-3 h-3 mr-1" />
                        Autorizado
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Protegido
                      </Badge>
                    )}
                  </div>

                  {channel === "call" && <p className="text-xs text-slate-500 mb-2">{caseData.debtor.phone.number}</p>}
                  {channel === "email" && caseData.debtor.email.address && <p className="text-xs text-slate-500 mb-2">{caseData.debtor.email.address}</p>}
                  {channel === "whatsapp" && <p className="text-xs text-slate-500 mb-2">{caseData.debtor.phone.number} · Opt-in: {caseData.debtor.phone.optIn ? "Sí" : "No"}</p>}
                  {channel === "sms" && <p className="text-xs text-slate-500 mb-2">{caseData.debtor.phone.number}</p>}

                  {!isAllowed && (
                    <div className="p-2 rounded-lg bg-emerald-100/50 border border-emerald-200 mb-2">
                      <p className="text-[10px] text-emerald-800 leading-relaxed">
                        {channel === "whatsapp" && "Legal Firewall: WhatsApp requiere opt-in + Ley 659 compliance. Este canal está protegido."}
                        {channel === "sms" && "Legal Firewall: SMS requiere autorización de contacto. Protegido por Data Passport."}
                        {channel === "email" && "Legal Firewall: Email bloqueado por disputa activa. Toda comunicación pausada."}
                        {channel === "call" && "Legal Firewall: Llamada bloqueada por disputa activa. Caso requiere revisión."}
                      </p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className={`w-full ${
                      isAllowed
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-200"
                    } ${firewallShake ? "animate-shake" : ""}`}
                    onClick={() => checkFirewall(channel)}
                    disabled={!!checkingChannel}
                  >
                    {checkingChannel === channel ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                        Verificando...
                      </span>
                    ) : isAllowed ? (
                      <span className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        Enviar
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verificar Legal Firewall
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" className="gap-1">
            <Activity className="w-4 h-4" /> Resumen
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1">
            <FileText className="w-4 h-4" /> Documentos
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1">
            <Clock className="w-4 h-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="passport" className="gap-1">
            <ShieldCheck className="w-4 h-4" /> Data Passport
          </TabsTrigger>
          <TabsTrigger value="disputes" className="gap-1">
            <Gavel className="w-4 h-4" /> Disputas
            {caseData.disputes.length > 0 && (
              <Badge className="ml-1.5 bg-amber-500 text-white text-[10px] h-4 px-1">{caseData.disputes.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Análisis del Caso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Producto</p>
                    <p className="text-sm font-bold text-slate-900">{caseData.product}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Identificación</p>
                    <p className="text-sm font-bold text-slate-900">{caseData.debtor.idNumber}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Teléfono</p>
                    <p className="text-sm font-bold text-slate-900">{caseData.debtor.phone.number}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {caseData.debtor.phone.allowed ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3 text-amber-500" />}
                      <span className="text-[10px] text-slate-500">Fuente: {caseData.debtor.phone.source}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-bold text-slate-900">{caseData.debtor.email.address || "No disponible"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {caseData.debtor.email.allowed ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3 text-amber-500" />}
                      <span className="text-[10px] text-slate-500">Fuente: {caseData.debtor.email.source}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Scores del Caso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "documental", label: "Documental", value: caseData.scores.documental, inv: false },
                  { key: "recuperabilidad", label: "Recuperabilidad", value: caseData.scores.recoverability, inv: false },
                  { key: "contactabilidad", label: "Contactabilidad", value: caseData.scores.contactability, inv: false },
                  { key: "riesgo", label: "Riesgo (inverso)", value: caseData.scores.risk, inv: true },
                ].map((score) => (
                  <div key={score.key} className="flex items-center gap-4">
                    <div className="w-24">
                      <p className="text-xs font-medium text-slate-700">{score.label}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${scoreBarColor(score.value, score.inv)}`} style={{ width: `${score.value}%` }} />
                        </div>
                        <span className={`text-xs font-bold w-8 ${scoreColor(score.value, score.inv)}`}>{score.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

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
                      <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${
                          doc.status === "complete" ? "text-emerald-700 border-emerald-200 bg-emerald-50" :
                          doc.status === "missing" ? "text-amber-700 border-amber-200 bg-amber-50" :
                          "text-blue-700 border-blue-200 bg-blue-50"
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
                      <div className={`w-9 h-9 rounded-full bg-white border-2 flex items-center justify-center z-10 flex-shrink-0 ${
                        event.type === "blocked" ? "border-emerald-300" :
                        event.type === "dispute" ? "border-amber-300" :
                        "border-slate-200"
                      }`}>
                        {timelineIcons[event.type] || timelineIcons.system}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-bold ${
                            event.type === "blocked" ? "text-emerald-800" :
                            event.type === "dispute" ? "text-amber-700" :
                            "text-slate-900"
                          }`}>
                            {event.action}
                          </p>
                          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatDate(event.date)}</span>
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
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Data Passport — Registro de Proveniencia
              </CardTitle>
              <CardDescription>
                Cada dato tiene su pasaporte legal. Se registra la fuente, base legal, usos permitidos y restricciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <p className="text-xs font-bold text-slate-500 uppercase">Fuente del dato</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{caseData.dataPassport.source}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Gavel className="w-4 h-4 text-slate-500" />
                    <p className="text-xs font-bold text-slate-500 uppercase">Base legal</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{caseData.dataPassport.legalBasis}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-600 uppercase">Usos permitidos</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {caseData.dataPassport.allowedUses.map((use) => (
                      <Badge key={use} className="bg-emerald-100 text-emerald-800 text-xs">{use}</Badge>
                    ))}
                  </div>
                </div>
                <div className={`p-4 rounded-lg border ${caseData.dataPassport.restrictions.length > 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <p className="text-xs font-bold text-amber-600 uppercase">Restricciones</p>
                  </div>
                  {caseData.dataPassport.restrictions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {caseData.dataPassport.restrictions.map((r) => (
                        <Badge key={r} className="bg-amber-100 text-amber-800 text-xs">{r}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Sin restricciones</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardContent className="p-4">
              {caseData.disputes.length === 0 ? (
                <div className="text-center py-8">
                  <ShieldCheck className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No hay disputas activas</p>
                  <p className="text-sm text-slate-400">Caso sin disputas registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {caseData.disputes.map((d, i) => (
                    <div key={i} className="p-4 rounded-lg border border-amber-200 bg-amber-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Gavel className="w-4 h-4 text-amber-600" />
                          </div>
                          <Badge className="bg-amber-100 text-amber-800">
                            {d.status === "open" ? "Abierta" : d.status === "resolved" ? "Resuelta" : "Escalada"}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">{formatDate(d.openedAt)}</span>
                      </div>
                      <p className="text-sm font-medium text-amber-900">{d.reason}</p>
                      <p className="text-xs text-amber-700 mt-2">
                        Toda gestión de cobro pausada automáticamente hasta resolución.
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
        <DialogContent className={`${firewallResult && !firewallResult.allowed ? "border-emerald-300 max-w-lg" : "border-emerald-300 max-w-lg"}`}>
          {firewallResult && (
            <>
              {firewallResult.allowed ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-700">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      Comunicación Autorizada — Legal Firewall
                    </DialogTitle>
                    <DialogDescription>
                      El Legal Firewall verificó que esta comunicación cumple con todas las regulaciones y políticas del caso.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Canal: {firewallResult.channel.toUpperCase()}</p>
                        <p className="text-xs text-emerald-600">Todas las validaciones pasadas</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-800">Data Passport verificado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-800">Opt-in confirmado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-800">Sin restricciones de contacto</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-emerald-800">Ley 172-13 compliant</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowFirewallModal(false)}>
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
                    <DialogTitle className="flex items-center gap-2 text-emerald-800">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      Legal Firewall — Protección Activada
                    </DialogTitle>
                    <DialogDescription className="text-emerald-700">
                      El sistema detectó intentos de contacto no autorizados y los bloqueó automáticamente para proteger su cumplimiento normativo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-900">Violaciones Prevenidas</span>
                      </div>
                      <div className="space-y-2">
                        {firewallResult.reasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
                            </div>
                            <p className="text-xs text-emerald-800 leading-relaxed">{reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Scale className="w-4 h-4" />
                      <span>
                        Esta acción fue registrada en el log de auditoría inmutable. <strong>Timestamp: {firewallResult.timestamp}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowFirewallModal(false)}>
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Entendido — Protección Activa
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

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