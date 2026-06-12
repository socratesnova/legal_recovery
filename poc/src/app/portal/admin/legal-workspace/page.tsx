"use client";

import {
  Gavel,
  Scale,
  BookOpen,
  Phone,
  Mic,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  LayoutList,
  User,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  PlayCircle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/seed-data";

const stats = [
  { label: "Casos listos para judicialización", value: 12, color: "emerald", icon: Gavel },
  { label: "Casos en revisión legal", value: 8, color: "amber", icon: Scale },
  { label: "Demandas preparadas", value: 3, color: "blue", icon: FileText },
  { label: "Sentencias favorables", value: 7, color: "purple", icon: CheckCircle2 },
];

const analysisResult = {
  case: "Caso case-011 - Hipoteca Banco León",
  strength: "Alta",
  strengthScore: 82,
  successProbability: 78,
  recommendation: "Judicializar vía ejecución hipotecaria",
  estimatedTime: "4-6 meses",
  estimatedCost: 125000,
  rationale: [
    "Contrato de préstamo hipotecario completo y firmado.",
    "Inscripción de hipoteca vigente en Registro Mercantil.",
    "Historial de mora superior a 180 días documentado.",
    "No se detectan defensas preliminares probables (falta de notificación, usura, etc.).",
  ],
};

const workflowStages = [
  {
    name: "Ingreso",
    items: [
      { id: "cw-001", name: "Caso case-009", amount: 450000, priority: "Alta" },
      { id: "cw-002", name: "Caso case-010", amount: 89000, priority: "Media" },
      { id: "cw-003", name: "Caso case-011", amount: 3200000, priority: "Alta" },
    ],
  },
  {
    name: "Análisis Documental",
    items: [
      { id: "cw-004", name: "Caso case-005", amount: 210000, priority: "Media" },
      { id: "cw-005", name: "Caso case-006", amount: 175000, priority: "Baja" },
      { id: "cw-006", name: "Caso case-007", amount: 640000, priority: "Alta" },
      { id: "cw-007", name: "Caso case-008", amount: 120000, priority: "Baja" },
    ],
  },
  {
    name: "Dictamen Legal",
    items: [
      { id: "cw-008", name: "Caso case-003", amount: 250000, priority: "Alta" },
      { id: "cw-009", name: "Caso case-004", amount: 310000, priority: "Media" },
      { id: "cw-010", name: "Caso case-012", amount: 95000, priority: "Baja" },
    ],
  },
  {
    name: "Preparación Demanda",
    items: [
      { id: "cw-011", name: "Caso case-013", amount: 540000, priority: "Alta" },
      { id: "cw-012", name: "Caso case-014", amount: 78000, priority: "Baja" },
      { id: "cw-013", name: "Caso case-015", amount: 1300000, priority: "Alta" },
    ],
  },
  {
    name: "Presentación Judicial",
    items: [
      { id: "cw-014", name: "Caso case-016", amount: 220000, priority: "Media" },
      { id: "cw-015", name: "Caso case-017", amount: 410000, priority: "Alta" },
      { id: "cw-016", name: "Caso case-018", amount: 160000, priority: "Baja" },
    ],
  },
  {
    name: "Resolución",
    items: [
      { id: "cw-017", name: "Caso case-019", amount: 890000, priority: "Alta" },
      { id: "cw-018", name: "Caso case-020", amount: 340000, priority: "Media" },
      { id: "cw-019", name: "Caso case-021", amount: 125000, priority: "Baja" },
    ],
  },
];

const callsLog = [
  {
    id: "call-001",
    debtor: "Juan Pérez",
    channel: "Voicebot",
    duration: "3m 24s",
    result: "Acuerdo verbal",
    transcript: "El deudor aceptó 3 cuotas con 20% descuento...",
    date: "2026-06-09T10:30:00Z",
    inProgress: false,
  },
  {
    id: "call-002",
    debtor: "María García",
    channel: "Llamada directa",
    duration: "5m 12s",
    result: "No contactado",
    transcript: "No contestó. Se dejó mensaje en buzón de voz...",
    date: "2026-06-09T09:15:00Z",
    inProgress: false,
  },
  {
    id: "call-003",
    debtor: "Pedro Martínez",
    channel: "Voicebot",
    duration: "2m 08s",
    result: "Disputa",
    transcript: "El deudor indicó que la deuda ya fue saldada...",
    date: "2026-06-09T08:45:00Z",
    inProgress: false,
  },
  {
    id: "call-004",
    debtor: "Ana López",
    channel: "Llamada directa",
    duration: "4m 45s",
    result: "Pago prometido",
    transcript: "Compromiso de pago total para el viernes...",
    date: "2026-06-08T16:20:00Z",
    inProgress: false,
  },
  {
    id: "call-005",
    debtor: "Luis Hernández",
    channel: "Voicebot",
    duration: "1m 30s",
    result: "En progreso",
    transcript: "Llamada en curso: validando identidad...",
    date: "2026-06-10T11:00:00Z",
    inProgress: true,
  },
];

const disputes = [
  {
    id: "disp-001",
    case: "Caso case-003 - Pedro Martínez",
    reason: "Deuda ya saldada",
    evidence: ["Comprobante de pago #4492", "Estado de cuenta cancelado"],
    status: "En revisión",
    lawyer: "Lic. María Fernández",
    estimatedDate: "2026-06-20",
  },
  {
    id: "disp-002",
    case: "Caso case-022 - Roberto Santos",
    reason: "Monto incorrecto",
    evidence: ["Contrato original", "Estados de cuenta bancaria"],
    status: "Pendiente de evidencia",
    lawyer: "Lic. Carlos Ramírez",
    estimatedDate: "2026-06-25",
  },
];

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Alta: "bg-red-50 text-red-700 border-red-200",
    Media: "bg-amber-50 text-amber-700 border-amber-200",
    Baja: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${colors[priority] ?? "bg-slate-50 text-slate-700"}`}>
      {priority}
    </Badge>
  );
}

function formatDateShort(dateStr: string) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default function LegalWorkspacePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Copiloto Legal</h1>
              <p className="text-sm text-slate-500">
                Asistencia AI para análisis legal y preparación de acciones judiciales
              </p>
            </div>
          </div>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 w-fit">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const colorMap: Record<string, { border: string; bg: string; icon: string }> = {
            emerald: { border: "border-l-emerald-500", bg: "bg-emerald-100", icon: "text-emerald-600" },
            amber: { border: "border-l-amber-500", bg: "bg-amber-100", icon: "text-amber-600" },
            blue: { border: "border-l-blue-500", bg: "bg-blue-100", icon: "text-blue-600" },
            purple: { border: "border-l-purple-500", bg: "bg-purple-100", icon: "text-purple-600" },
          };
          const c = colorMap[s.color];
          const Icon = s.icon;
          return (
            <Card key={s.label} className={`border-l-4 ${c.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Legal Copilot Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <CardTitle>AI Legal Copilot</CardTitle>
          </div>
          <CardDescription>
            Describa un caso para recibir análisis de fortaleza documental, probabilidad de éxito y recomendación de acción judicial.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <textarea
              placeholder="Describa el caso para análisis legal..."
              className="flex min-h-[96px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
            <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Sparkles className="w-4 h-4 mr-2" />
              Analizar con AI
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Resultado del análisis</h3>
              </div>
              <Badge variant="outline" className="text-xs bg-white">
                {analysisResult.case}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Fortaleza documental</span>
                    <span className="text-xs font-bold text-emerald-700">{analysisResult.strength} ({analysisResult.strengthScore}%)</span>
                  </div>
                  <Progress value={analysisResult.strengthScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Probabilidad de éxito</span>
                    <span className="text-xs font-bold text-emerald-700">{analysisResult.successProbability}%</span>
                  </div>
                  <Progress value={analysisResult.successProbability} className="h-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Recomendación de acción</p>
                    <p className="text-sm font-medium text-slate-900">{analysisResult.recommendation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Tiempo estimado</p>
                    <p className="text-sm font-medium text-slate-900">{analysisResult.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Costo estimado</p>
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(analysisResult.estimatedCost)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Razonamiento AI</p>
              <ul className="space-y-1">
                {analysisResult.rationale.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Stage Pipeline */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LayoutList className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Pipeline de Etapas Legales</h2>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[720px]">
            {workflowStages.map((stage) => (
              <div key={stage.name} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">{stage.name}</h3>
                  <Badge variant="outline" className="text-[10px] bg-white">
                    {stage.items.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stage.items.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-emerald-400 hover:shadow-sm transition-shadow">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-slate-900 truncate">{item.name}</p>
                          <PriorityBadge priority={item.priority} />
                        </div>
                        <p className="text-xs text-slate-500">{formatCurrency(item.amount)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voicebot/Calls Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <CardTitle>Registro de Llamadas / Voicebot</CardTitle>
          </div>
          <CardDescription>Últimas interacciones telefónicas y voicebot.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Deudor</TableHead>
                <TableHead className="whitespace-nowrap">Canal</TableHead>
                <TableHead className="whitespace-nowrap">Duración</TableHead>
                <TableHead className="whitespace-nowrap">Resultado</TableHead>
                <TableHead className="whitespace-nowrap">Transcript</TableHead>
                <TableHead className="whitespace-nowrap">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callsLog.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {call.inProgress && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                      )}
                      <span className="text-sm text-slate-900">{call.debtor}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {call.channel === "Voicebot" ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      {call.channel}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-slate-600">{call.duration}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        call.result === "Acuerdo verbal" || call.result === "Pago prometido"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : call.result === "Disputa"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : call.result === "En progreso"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {call.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-xs truncate">{call.transcript}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-slate-500">{formatDateShort(call.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dispute Resolution Panel */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Resolución de Disputas</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {disputes.map((d) => (
            <Card key={d.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{d.case}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      d.status === "En revisión"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {d.status}
                  </Badge>
                </div>
                <CardDescription>{d.reason}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">Evidencia presentada</p>
                  <div className="flex flex-wrap gap-2">
                    {d.evidence.map((ev, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 text-slate-700">
                        <FileText className="w-3 h-3 mr-1" />
                        {ev}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-[10px] text-slate-500">Abogado asignado</p>
                      <p className="text-xs font-medium text-slate-900">{d.lawyer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-[10px] text-slate-500">Resolución estimada</p>
                      <p className="text-xs font-medium text-slate-900">{d.estimatedDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
