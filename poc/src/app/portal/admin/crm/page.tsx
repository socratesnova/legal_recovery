"use client";

import { useState } from "react";
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Brain,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  Filter,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Send,
  PhoneCall,
  MailOpen,
  CalendarCheck,
  StickyNote,
  Activity,
  Zap,
  ArrowRight,
  ArrowLeft,
  Funnel,
  DollarSign,
  Percent,
  UserCheck,
  Bookmark,
  Tag,
  Timer,
  Flag,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate, demoCases } from "@/lib/seed-data";
import Link from "next/link";

const pipelineStages = [
  { id: "new", label: "Nuevo", color: "bg-slate-100 border-slate-300", count: 450, amount: 18500000 },
  { id: "contacted", label: "Contactado", color: "bg-blue-50 border-blue-300", count: 380, amount: 14200000 },
  { id: "negotiation", label: "Negociación", color: "bg-amber-50 border-amber-300", count: 210, amount: 9800000 },
  { id: "agreement", label: "Acuerdo", color: "bg-purple-50 border-purple-300", count: 85, amount: 4200000 },
  { id: "payment", label: "Pago", color: "bg-emerald-50 border-emerald-300", count: 120, amount: 6500000 },
  { id: "closed", label: "Cerrado", color: "bg-slate-50 border-slate-300", count: 95, amount: 3800000 },
];

const crmContacts = [
  {
    id: "crm-001",
    caseId: "case-001",
    name: "Juan Pérez",
    idNumber: "001-1234567-8",
    stage: "negotiation",
    lastActivity: "2026-06-09T14:30:00Z",
    nextFollowUp: "2026-06-11T10:00:00Z",
    assignedTo: "Carlos Ramírez",
    priority: "high",
    balance: 125000,
    totalContacts: 8,
    successfulContacts: 5,
    lastChannel: "call",
    status: "active",
    notes: 3,
    tasks: 2,
  },
  {
    id: "crm-002",
    caseId: "case-002",
    name: "María García",
    idNumber: "002-7654321-0",
    stage: "new",
    lastActivity: "2026-06-08T09:15:00Z",
    nextFollowUp: "2026-06-12T14:00:00Z",
    assignedTo: "Carlos Ramírez",
    priority: "medium",
    balance: 89000,
    totalContacts: 3,
    successfulContacts: 0,
    lastChannel: "email",
    status: "blocked",
    notes: 2,
    tasks: 3,
  },
  {
    id: "crm-003",
    caseId: "case-003",
    name: "Pedro Martínez",
    idNumber: "003-1111111-2",
    stage: "closed",
    lastActivity: "2026-06-09T09:00:00Z",
    nextFollowUp: null,
    assignedTo: "Lic. María Fernández",
    priority: "high",
    balance: 250000,
    totalContacts: 5,
    successfulContacts: 0,
    lastChannel: "portal",
    status: "disputed",
    notes: 4,
    tasks: 1,
  },
  {
    id: "crm-004",
    caseId: "case-004",
    name: "Ana Rodríguez",
    idNumber: "004-2222222-4",
    stage: "agreement",
    lastActivity: "2026-06-09T11:30:00Z",
    nextFollowUp: "2026-06-10T09:00:00Z",
    assignedTo: "Luis Martínez",
    priority: "high",
    balance: 175000,
    totalContacts: 12,
    successfulContacts: 8,
    lastChannel: "call",
    status: "active",
    notes: 5,
    tasks: 2,
  },
  {
    id: "crm-005",
    caseId: "case-005",
    name: "Carlos Sánchez",
    idNumber: "005-3333333-6",
    stage: "contacted",
    lastActivity: "2026-06-09T16:00:00Z",
    nextFollowUp: "2026-06-11T11:00:00Z",
    assignedTo: "Carlos Ramírez",
    priority: "low",
    balance: 65000,
    totalContacts: 4,
    successfulContacts: 2,
    lastChannel: "sms",
    status: "active",
    notes: 1,
    tasks: 1,
  },
  {
    id: "crm-006",
    caseId: "case-006",
    name: "Laura Fernández",
    idNumber: "006-4444444-8",
    stage: "payment",
    lastActivity: "2026-06-09T08:00:00Z",
    nextFollowUp: "2026-06-15T10:00:00Z",
    assignedTo: "Luis Martínez",
    priority: "medium",
    balance: 320000,
    totalContacts: 15,
    successfulContacts: 10,
    lastChannel: "call",
    status: "active",
    notes: 6,
    tasks: 0,
  },
  {
    id: "crm-007",
    caseId: "case-007",
    name: "Diego Morales",
    idNumber: "007-5555555-0",
    stage: "new",
    lastActivity: "2026-06-08T10:00:00Z",
    nextFollowUp: "2026-06-13T15:00:00Z",
    assignedTo: "Carlos Ramírez",
    priority: "medium",
    balance: 145000,
    totalContacts: 2,
    successfulContacts: 1,
    lastChannel: "email",
    status: "active",
    notes: 1,
    tasks: 2,
  },
  {
    id: "crm-008",
    caseId: "case-008",
    name: "Isabel Castillo",
    idNumber: "008-6666666-2",
    stage: "negotiation",
    lastActivity: "2026-06-09T13:00:00Z",
    nextFollowUp: "2026-06-11T16:00:00Z",
    assignedTo: "Luis Martínez",
    priority: "high",
    balance: 210000,
    totalContacts: 9,
    successfulContacts: 6,
    lastChannel: "call",
    status: "active",
    notes: 4,
    tasks: 3,
  },
];

const activities = [
  { id: "act-001", contactId: "crm-001", type: "call", description: "Llamada de oferta - 3 cuotas 20% descuento", user: "Carlos Ramírez", timestamp: "2026-06-09T14:30:00Z", outcome: "positive", duration: "4:30" },
  { id: "act-002", contactId: "crm-002", type: "email", description: "Email recordatorio de saldo", user: "Sistema", timestamp: "2026-06-08T09:15:00Z", outcome: "no_response" },
  { id: "act-003", contactId: "crm-003", type: "note", description: "Disputa abierta por deudor - comprobante de pago", user: "Pedro Martínez", timestamp: "2026-06-09T09:00:00Z", outcome: "blocked" },
  { id: "act-004", contactId: "crm-004", type: "call", description: "Aceptación de acuerdo verbal - 4 cuotas", user: "Luis Martínez", timestamp: "2026-06-09T11:30:00Z", outcome: "agreed" },
  { id: "act-005", contactId: "crm-005", type: "sms", description: "SMS con enlace a portal deudor", user: "Sistema", timestamp: "2026-06-09T16:00:00Z", outcome: "delivered" },
  { id: "act-006", contactId: "crm-006", type: "payment", description: "Pago recibido RD$80,000 - cuota 2/6", user: "Sistema", timestamp: "2026-06-09T08:00:00Z", outcome: "success" },
  { id: "act-007", contactId: "crm-007", type: "email", description: "Email de primer contacto con oferta", user: "Sistema", timestamp: "2026-06-08T10:00:00Z", outcome: "opened" },
  { id: "act-008", contactId: "crm-008", type: "call", description: "Negociación - deudor solicita 6 cuotas", user: "Luis Martínez", timestamp: "2026-06-09T13:00:00Z", outcome: "negotiating" },
];

const tasks = [
  { id: "task-001", contactId: "crm-001", title: "Llamar para confirmar acuerdo", dueDate: "2026-06-11T10:00:00Z", priority: "high", status: "pending", assignedTo: "Carlos Ramírez" },
  { id: "task-002", contactId: "crm-002", title: "Validar fuentes de contacto autorizadas", dueDate: "2026-06-12T14:00:00Z", priority: "medium", status: "pending", assignedTo: "Carlos Ramírez" },
  { id: "task-003", contactId: "crm-003", title: "Revisar comprobante de pago con banco", dueDate: "2026-06-10T09:00:00Z", priority: "high", status: "in_progress", assignedTo: "Lic. María Fernández" },
  { id: "task-004", contactId: "crm-004", title: "Generar acuerdo formal y enviar", dueDate: "2026-06-10T09:00:00Z", priority: "high", status: "pending", assignedTo: "Luis Martínez" },
  { id: "task-005", contactId: "crm-008", title: "Responder solicitud de 6 cuotas", dueDate: "2026-06-11T16:00:00Z", priority: "high", status: "pending", assignedTo: "Luis Martínez" },
  { id: "task-006", contactId: "crm-006", title: "Verificar pago y enviar recibo", dueDate: "2026-06-15T10:00:00Z", priority: "medium", status: "pending", assignedTo: "Luis Martínez" },
];

const activityIcons: Record<string, React.ReactNode> = {
  call: <PhoneCall className="w-4 h-4 text-blue-500" />,
  email: <MailOpen className="w-4 h-4 text-amber-500" />,
  sms: <MessageSquare className="w-4 h-4 text-purple-500" />,
  note: <StickyNote className="w-4 h-4 text-slate-500" />,
  payment: <DollarSign className="w-4 h-4 text-emerald-500" />,
};

const outcomeConfig: Record<string, { label: string; color: string }> = {
  positive: { label: "Positivo", color: "bg-emerald-100 text-emerald-800" },
  agreed: { label: "Acordado", color: "bg-purple-100 text-purple-800" },
  negotiating: { label: "Negociando", color: "bg-amber-100 text-amber-800" },
  delivered: { label: "Entregado", color: "bg-blue-100 text-blue-800" },
  opened: { label: "Abierto", color: "bg-blue-100 text-blue-800" },
  success: { label: "Éxito", color: "bg-emerald-100 text-emerald-800" },
  no_response: { label: "Sin respuesta", color: "bg-slate-100 text-slate-800" },
  blocked: { label: "Bloqueado", color: "bg-red-100 text-red-800" },
};

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedContact, setSelectedContact] = useState<typeof crmContacts[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filteredContacts = crmContacts.filter(
    (c) =>
      (selectedStage ? c.stage === selectedStage : true) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.idNumber.includes(searchQuery) ||
        c.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPipelineAmount = pipelineStages.reduce((a, s) => a + s.amount, 0);
  const totalContacts = crmContacts.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const todayActivities = activities.filter(
    (a) => new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CRM — Gestión de Contactos</h1>
            <p className="text-sm text-slate-500">
              Pipeline de cobro, actividades, tareas y seguimiento de deudores
            </p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contacto
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Contactos CRM</p>
                <p className="text-2xl font-bold text-slate-900">{totalContacts}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{crmContacts.filter(c => c.status === "active").length} activos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Pipeline Total</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPipelineAmount)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Funnel className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{pipelineStages.reduce((a, s) => a + s.count, 0)} casos en pipeline</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-slate-900">{pendingTasks}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{tasks.filter(t => t.priority === "high" && t.status === "pending").length} de alta prioridad</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Actividades Hoy</p>
                <p className="text-2xl font-bold text-slate-900">{todayActivities}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{activities.filter(a => a.outcome === "positive" || a.outcome === "agreed" || a.outcome === "success").length} exitosas</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <Button variant={activeTab === "pipeline" ? "default" : "ghost"} size="sm" className={activeTab === "pipeline" ? "bg-pink-600" : ""} onClick={() => setActiveTab("pipeline")}>
          <Funnel className="w-4 h-4 mr-1" /> Pipeline
        </Button>
        <Button variant={activeTab === "contacts" ? "default" : "ghost"} size="sm" className={activeTab === "contacts" ? "bg-pink-600" : ""} onClick={() => setActiveTab("contacts")}>
          <Users className="w-4 h-4 mr-1" /> Contactos
        </Button>
        <Button variant={activeTab === "activities" ? "default" : "ghost"} size="sm" className={activeTab === "activities" ? "bg-pink-600" : ""} onClick={() => setActiveTab("activities")}>
          <Activity className="w-4 h-4 mr-1" /> Actividades
        </Button>
        <Button variant={activeTab === "tasks" ? "default" : "ghost"} size="sm" className={activeTab === "tasks" ? "bg-pink-600" : ""} onClick={() => setActiveTab("tasks")}>
          <CalendarCheck className="w-4 h-4 mr-1" /> Tareas
        </Button>
      </div>

      {activeTab === "pipeline" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineStages.map((stage) => (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  selectedStage === stage.id ? "ring-2 ring-pink-500" : ""
                } ${stage.color}`}
                onClick={() => { setSelectedStage(selectedStage === stage.id ? null : stage.id); setActiveTab("contacts"); }}
              >
                <p className="text-xs font-bold text-slate-700">{stage.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{stage.count}</p>
                <p className="text-xs text-slate-500">{formatCurrency(stage.amount)}</p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-600" />
                Progreso del Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pipelineStages.map((stage) => {
                  const pct = Math.round((stage.amount / totalPipelineAmount) * 100);
                  return (
                    <div key={stage.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{stage.label}</span>
                        <span className="text-slate-500">{stage.count} casos · {formatCurrency(stage.amount)} ({pct}%)</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "contacts" && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar contacto..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" /> Filtros
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Última Act.</TableHead>
                    <TableHead>Próx. Seguimiento</TableHead>
                    <TableHead>Asignado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => {
                    const stage = pipelineStages.find((s) => s.id === contact.stage);
                    const priorityColor = contact.priority === "high" ? "bg-red-100 text-red-800" : contact.priority === "medium" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800";
                    return (
                      <TableRow key={contact.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-700">
                              {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-900">{contact.name}</p>
                              <p className="text-xs text-slate-500">{contact.idNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${stage?.color.replace("border", "bg").replace("300", "200") || "bg-slate-100"}`}>
                            {stage?.label || contact.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(contact.balance)}</TableCell>
                        <TableCell>
                          <p className="text-xs text-slate-500">{formatDate(contact.lastActivity)}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {activityIcons[contact.lastChannel]}
                            <span className="text-[10px] text-slate-400">{contact.totalContacts} contactos</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.nextFollowUp ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-600">{formatDate(contact.nextFollowUp)}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{contact.assignedTo}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${priorityColor}`}>
                            {contact.priority === "high" ? "Alta" : contact.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "activities" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-600" />
              Historial de Actividades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((act) => {
              const contact = crmContacts.find((c) => c.id === act.contactId);
              const outcome = outcomeConfig[act.outcome];
              return (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {activityIcons[act.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{contact?.name}</span>
                      <Badge className={`text-[10px] ${outcome.color}`}>{outcome.label}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{act.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{act.user}</span>
                      <span>·</span>
                      <span>{formatDate(act.timestamp)}</span>
                      {act.duration && (
                        <>
                          <span>·</span>
                          <span>{act.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {activeTab === "tasks" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-pink-600" />
              Tareas y Seguimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const contact = crmContacts.find((c) => c.id === task.contactId);
                  return (
                    <TableRow key={task.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-sm">{task.title}</TableCell>
                      <TableCell className="text-sm text-slate-600">{contact?.name}</TableCell>
                      <TableCell className="text-sm">{formatDate(task.dueDate)}</TableCell>
                      <TableCell>
                        <Badge className={task.priority === "high" ? "bg-red-100 text-red-800 text-[10px]" : "bg-blue-100 text-blue-800 text-[10px]"}>
                          {task.priority === "high" ? "Alta" : "Media"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={task.status === "pending" ? "bg-amber-100 text-amber-800 text-[10px]" : "bg-emerald-100 text-emerald-800 text-[10px]"}>
                          {task.status === "pending" ? "Pendiente" : "En progreso"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{task.assignedTo}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          {selectedContact && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-700">
                    {selectedContact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  {selectedContact.name}
                </DialogTitle>
                <DialogDescription>{selectedContact.idNumber} · Saldo: {formatCurrency(selectedContact.balance)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Etapa</p>
                    <Badge className="mt-1">{pipelineStages.find((s) => s.id === selectedContact.stage)?.label}</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Asignado</p>
                    <p className="text-sm font-medium">{selectedContact.assignedTo}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Contactos</p>
                    <p className="text-sm font-medium">{selectedContact.successfulContacts}/{selectedContact.totalContacts} exitosos</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Notas</p>
                    <p className="text-sm font-medium">{selectedContact.notes} notas · {selectedContact.tasks} tareas</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-sm font-bold text-emerald-900">AI Recommendation:</p>
                  <p className="text-xs text-emerald-700">
                    {selectedContact.priority === "high" ? "Prioridad alta — contactar en próximas 24h. Probabilidad de acuerdo: 78%." : "Seguimiento estándar — próximo contacto en 48h."}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
