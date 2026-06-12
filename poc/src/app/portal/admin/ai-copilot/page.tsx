"use client";

import {
  Brain,
  Zap,
  Target,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  Gavel,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Fingerprint,
  Lock,
  Eye,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bot,
  UserCircle,
  Ban,
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
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { demoCases, formatCurrency, formatDate } from "@/lib/seed-data";
import Link from "next/link";
import { useState } from "react";

const copilotRecommendations = [
  {
    id: "rec-001",
    caseId: "case-001",
    debtor: "Juan Pérez",
    type: "next_best_action",
    priority: "high",
    title: "Oferta de 3 cuotas con 20% descuento",
    description: "Alta recuperabilidad (85/100) + alta contactabilidad (90/100). Probabilidad de aceptación: 78%.",
    suggestedChannel: "call",
    suggestedMessage: "Estimado cliente, tenemos una oferta especial: 3 cuotas de RD$33,333 con 20% descuento. ¿Acepta?",
    risks: [],
    confidence: 85,
    approved: true,
    timestamp: "2026-06-09T14:30:00Z",
  },
  {
    id: "rec-002",
    caseId: "case-002",
    debtor: "María García",
    type: "documental",
    priority: "medium",
    title: "Cesión de cartera faltante - requiere validación",
    description: "Documento 'Cesión de cartera' en estado pendiente. Sin este documento, el caso no puede judicializarse.",
    suggestedAction: "Solicitar cesión original al banco cedente",
    risks: ["Sin cesión, acciones legales no proceden"],
    confidence: 92,
    approved: false,
    timestamp: "2026-06-09T10:15:00Z",
  },
  {
    id: "rec-003",
    caseId: "case-003",
    debtor: "Pedro Martínez",
    type: "dispute",
    priority: "high",
    title: "Caso en disputa - pausar hasta resolución",
    description: "Deudor presentó comprobante de pago. Disputa activa bloquea toda comunicación. Recomendación: revisar comprobante y verificar con banco.",
    suggestedAction: "Revisar comprobante de pago con banco cedente",
    risks: ["Continuar gestión = posible sanción Ley 172-13", "Reputación del banco en riesgo"],
    confidence: 98,
    approved: true,
    timestamp: "2026-06-09T09:00:00Z",
  },
  {
    id: "rec-004",
    caseId: "case-002",
    debtor: "María García",
    type: "channel_strategy",
    priority: "low",
    title: "Canal portal como única opción viable",
    description: "Contactabilidad bloqueada (20/100). Teléfono y email sin autorización. Único canal: portal deudor si el deudor accede voluntariamente.",
    suggestedChannel: "portal",
    suggestedMessage: "Envíe comunicación al portal deudor con propuesta de acuerdo",
    risks: ["Baja tasa de respuesta en portal sin notificación previa"],
    confidence: 65,
    approved: false,
    timestamp: "2026-06-09T11:00:00Z",
  },
];

const qualityReviews = [
  {
    id: "qr-001",
    caseId: "case-001",
    type: "positive",
    summary: "Llamada del 2026-06-07 siguió el guión permitido. Tono profesional. No se mencionaron datos de terceros.",
    score: 95,
    flags: [],
  },
  {
    id: "qr-002",
    caseId: "case-002",
    type: "warning",
    summary: "Intento de WhatsApp detectado. WhatsApp requiere opt-in + aprobación de plantillas. Canal restringido para este caso.",
    score: 40,
    flags: ["Canal restringido: WhatsApp", "Dato JCE sin autorización de contacto"],
  },
];

export default function AICopilotPage() {
  const [activeTab, setActiveTab] = useState("recommendations");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Copilot — Asistente Inteligente</h1>
              <p className="text-sm text-slate-500">
                Recomendaciones de next best action, análisis de calidad, y guiones de contacto
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Activa
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <Bot className="w-3 h-3 mr-1" />
            Human-in-the-loop
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Recomendaciones Hoy</p>
                <p className="text-2xl font-bold text-slate-900">{copilotRecommendations.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">{copilotRecommendations.filter(r => r.approved).length} aprobadas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Confianza Promedio</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(copilotRecommendations.reduce((a, r) => a + r.confidence, 0) / copilotRecommendations.length)}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Basado en modelos locales</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Revisiones Calidad</p>
                <p className="text-2xl font-bold text-slate-900">{qualityReviews.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Detección de incumplimiento</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round((copilotRecommendations.filter(r => r.approved).length / copilotRecommendations.length) * 100)}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Humano decide siempre</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <Button
          variant={activeTab === "recommendations" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "recommendations" ? "bg-purple-600" : ""}
          onClick={() => setActiveTab("recommendations")}
        >
          <Zap className="w-4 h-4 mr-1" />
          Recomendaciones
        </Button>
        <Button
          variant={activeTab === "quality" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "quality" ? "bg-purple-600" : ""}
          onClick={() => setActiveTab("quality")}
        >
          <ShieldCheck className="w-4 h-4 mr-1" />
          Calidad
        </Button>
        <Button
          variant={activeTab === "scripts" ? "default" : "ghost"}
          size="sm"
          className={activeTab === "scripts" ? "bg-purple-600" : ""}
          onClick={() => setActiveTab("scripts")}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Guiones
        </Button>
      </div>

      {activeTab === "recommendations" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Next Best Action — Recomendaciones
          </h2>
          <p className="text-sm text-slate-500">
            Cada recomendación es generada por IA local y requiere aprobación humana antes de ejecutarse.
          </p>

          <div className="grid gap-4">
            {copilotRecommendations.map((rec) => {
              const caseData = demoCases.find((c) => c.id === rec.caseId);
              return (
                <Card key={rec.id} className={`border-l-4 ${rec.priority === "high" ? "border-l-red-400" : rec.priority === "medium" ? "border-l-amber-400" : "border-l-blue-400"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rec.approved ? "bg-emerald-100" : "bg-slate-100"
                      }`}>
                        {rec.approved ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-slate-500" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={rec.approved ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-slate-100 text-slate-800 text-[10px]"}>
                            {rec.approved ? "Aprobada" : "Pendiente"}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] ${
                            rec.priority === "high" ? "text-red-700 border-red-200" : rec.priority === "medium" ? "text-amber-700 border-amber-200" : "text-blue-700 border-blue-200"
                          }`}>
                            {rec.priority === "high" ? "Prioridad alta" : rec.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            Confianza: {rec.confidence}%
                          </Badge>
                        </div>

                        <p className="text-sm font-bold text-slate-900">{rec.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{rec.description}</p>

                        {rec.suggestedChannel && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">Canal sugerido:</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {rec.suggestedChannel === "call" && <Phone className="w-3 h-3 mr-1" />}
                              {rec.suggestedChannel === "email" && <Mail className="w-3 h-3 mr-1" />}
                              {rec.suggestedChannel === "portal" && <MessageSquare className="w-3 h-3 mr-1" />}
                              {rec.suggestedChannel === "sms" && <MessageSquare className="w-3 h-3 mr-1" />}
                              {rec.suggestedChannel}
                            </Badge>
                          </div>
                        )}

                        {rec.suggestedMessage && (
                          <div className="p-3 rounded-lg bg-slate-50 mt-2 border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-slate-500" />
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Guion sugerido</span>
                            </div>
                            <p className="text-xs text-slate-700 italic">"{rec.suggestedMessage}"</p>
                          </div>
                        )}

                        {rec.risks.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {rec.risks.map((risk, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-amber-700">
                                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                {risk}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-slate-400">{rec.debtor} · {formatDate(rec.timestamp)}</span>
                        </div>

                        <div className="flex justify-end gap-2 mt-3">
                          {!rec.approved && (
                            <>
                              <Button variant="outline" size="sm">
                                <XCircle className="w-3 h-3 mr-1" />
                                Rechazar
                              </Button>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Aprobar
                              </Button>
                            </>
                          )}
                          {rec.approved && (
                            <Link href={`/portal/admin/cases/${rec.caseId}`}>
                              <Button variant="outline" size="sm">
                                Ver caso
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "quality" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Quality AI — Revisión de Calidad
          </h2>
          <p className="text-sm text-slate-500">
            Análisis automático de comunicaciones y contactos para detectar incumplimientos o riesgos.
          </p>

          <div className="grid gap-4">
            {qualityReviews.map((qr) => (
              <Card key={qr.id} className={`border-l-4 ${qr.type === "positive" ? "border-l-emerald-400" : "border-l-amber-400"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      qr.type === "positive" ? "bg-emerald-100" : "bg-amber-100"
                    }`}>
                      {qr.type === "positive" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={qr.type === "positive" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                          {qr.type === "positive" ? "Compliant" : "Advertencia"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Score: {qr.score}/100
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{qr.summary}</p>
                      {qr.flags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {qr.flags.map((f, i) => (
                            <Badge key={i} className="bg-amber-50 text-amber-700 text-[10px] border-amber-200">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {f}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "scripts" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Guiones de Contacto Generados por AI
          </h2>
          <p className="text-sm text-slate-500">
            Guiones personalizados por caso, validados contra Legal Firewall y políticas de contacto.
          </p>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="script-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>Juan Pérez — Llamada de oferta</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] ml-2">Aprobado</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                  <p className="text-sm font-bold text-slate-700">Guion de llamada:</p>
                  <p className="text-sm text-slate-600">
                    "Buenos días, señor Pérez. Soy María de la oficina legal de Banco Popular. Le llamamos porque tenemos una oferta especial para su tarjeta de crédito castigada. Podemos ofrecerle un 20% de descuento si acepta pagar en 3 cuotas de RD$33,333. ¿Le interesa esta opción?"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Validado por Legal Firewall · Canal autorizado: llamada
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="script-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>María García — Email (único canal viable)</span>
                  <Badge className="bg-amber-100 text-amber-800 text-[10px] ml-2">Pendiente</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                  <p className="text-sm font-bold text-slate-700">Guion de email:</p>
                  <p className="text-sm text-slate-600">
                    "Estimada señora García, le contactamos desde la oficina legal de Banco BHD respecto a su préstamo personal. Le informamos que su cuenta presenta un saldo pendiente. Por favor, acceda a nuestro portal para verificar su situación y explorar opciones de acuerdo."
                  </p>
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <AlertTriangle className="w-3 h-3" />
                    Teléfono y SMS bloqueados por Legal Firewall. Email es el único canal viable.
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="script-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Ban className="w-4 h-4 text-red-500" />
                  <span>Pedro Martínez — Contacto bloqueado (disputa)</span>
                  <Badge className="bg-red-100 text-red-800 text-[10px] ml-2">Bloqueado</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 bg-red-50 rounded-lg space-y-2">
                  <p className="text-sm font-bold text-red-700">No se genera guion — Caso en disputa</p>
                  <p className="text-sm text-red-600">
                    El caso está en disputa activa. Toda comunicación está bloqueada por Legal Firewall hasta resolución. No se generan guiones de contacto.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-red-700">
                    <Lock className="w-3 h-3" />
                    Legal Firewall: Disputa activa · Comunicación pausada
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}