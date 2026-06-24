"use client";

import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  Gavel,
  FileText,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Fingerprint,
  BadgeCheck,
  Ban,
  Brain,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Eye,
  Filter,
  Search,
  KeyRound,
  Globe,
  Building2,
  GraduationCap,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { demoCases, formatDate } from "@/lib/seed-data";
import { useState } from "react";

const leyes = [
  {
    id: "ley-172-13",
    nombre: "Ley 172-13",
    titulo: "Protección de Datos Personales (RD)",
    estado: "compliant",
    descripcion: "Regula el tratamiento de datos personales. Requiere consentimiento, finalidad específica, y derechos ARCO.",
    requisitos: [
      "Consentimiento informado para contacto",
      "Finalidad específica del tratamiento",
      "Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)",
      "Notificación de brechas en 72h",
      "Registro de bases de datos",
    ],
    cumplimiento: 98,
  },
  {
    id: "ley-659",
    nombre: "Ley 659",
    titulo: "Actos del Estado Civil (RD)",
    estado: "compliant",
    descripcion: "Regula el uso de datos del JCE. Solo para actos del estado civil, no para contacto comercial.",
    requisitos: [
      "Uso exclusivo para actos del estado civil",
      "Prohibido contacto comercial con datos JCE",
      "Validación de identidad permitida",
    ],
    cumplimiento: 100,
  },
  {
    id: "whatsapp-policy",
    nombre: "WhatsApp Business Policy",
    titulo: "Meta Business Messaging Policy",
    estado: "compliant",
    descripcion: "Prohíbe el uso de WhatsApp para cobranza de deudas. Solo mensajes de utilidad/autenticación.",
    requisitos: [
      "Opt-in explícito del usuario",
      "Plantillas pre-aprobadas por Meta",
      "Prohibida cobranza de deudas",
      "Solo mensajes de utilidad y autenticación",
    ],
    cumplimiento: 100,
  },
  {
    id: "data-retention",
    nombre: "Retención de Datos",
    titulo: "Política de Retención y Eliminación",
    estado: "warning",
    descripcion: "Datos de contacto requieren re-validación anual. Casos cerrados: 5 años retención mínima.",
    requisitos: [
      "Re-validación de consentimiento anual",
      "Cifrado AES-256 en reposo y tránsito",
      "Casos cerrados: 5 años retención",
      "Eliminación segura (DoD 5220.22-M)",
    ],
    cumplimiento: 85,
  },
];

const firewallRules = [
  {
    id: "fw-001",
    nombre: "Bloqueo JCE sin autorización",
    descripcion: "Datos de contacto obtenidos del JCE no pueden usarse para contacto comercial.",
    estado: "active",
    impacto: "high",
    activaciones: 12,
    prevenciones: 12,
  },
  {
    id: "fw-002",
    nombre: "Bloqueo WhatsApp sin opt-in",
    descripcion: "WhatsApp requiere opt-in explícito + plantillas aprobadas.",
    estado: "active",
    impacto: "high",
    activaciones: 8,
    prevenciones: 8,
  },
  {
    id: "fw-003",
    nombre: "Pausa por disputa activa",
    descripcion: "Caso con disputa abierta: toda comunicación pausada automáticamente.",
    estado: "active",
    impacto: "high",
    activaciones: 3,
    prevenciones: 3,
  },
  {
    id: "fw-004",
    nombre: "Bloqueo contacto terceros",
    descripcion: "Teléfono/email de terceros requiere consentimiento explícito.",
    estado: "active",
    impacto: "medium",
    activaciones: 2,
    prevenciones: 2,
  },
  {
    id: "fw-005",
    nombre: "Data Passport vencido",
    descripcion: "Datos con Data Passport expirado requieren re-validación.",
    estado: "active",
    impacto: "low",
    activaciones: 1,
    prevenciones: 1,
  },
];

const dataClassification = [
  { type: "Identificación", ejemplos: "Cédula, pasaporte, RNC", nivel: "high", casos: 1200, protegidos: 1200 },
  { type: "Contacto", ejemplos: "Teléfono, email, dirección", nivel: "medium", casos: 850, protegidos: 850 },
  { type: "Financiero", ejemplos: "Saldo, pagos, producto", nivel: "high", casos: 1200, protegidos: 1200 },
  { type: "Judicial", ejemplos: "Contrato, cesión, pagaré", nivel: "high", casos: 1185, protegidos: 1185 },
  { type: "Comportamiento", ejemplos: "Score, respuestas, disputas", nivel: "low", casos: 1200, protegidos: 1200 },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalActivaciones = firewallRules.reduce((a, r) => a + r.activaciones, 0);
  const totalPrevenciones = firewallRules.reduce((a, r) => a + r.prevenciones, 0);
  const avgCompliance = Math.round(leyes.reduce((a, l) => a + l.cumplimiento, 0) / leyes.length);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Compliance y Legal Firewall</h1>
              <p className="text-sm text-slate-500">
                Gobierno de datos, normativas aplicadas y protección automática
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Ley 172-13 Compliant
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <Gavel className="w-3 h-3 mr-1" />
            Ley 659 Compliant
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Cumplimiento</p>
                <p className="text-2xl font-bold text-emerald-700">{avgCompliance}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={avgCompliance} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Reglas Activas</p>
                <p className="text-2xl font-bold text-slate-900">{firewallRules.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">100% protección activa</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Violaciones Prevenidas</p>
                <p className="text-2xl font-bold text-emerald-700">{totalPrevenciones}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Ban className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Últimos 30 días</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Datos Protegidos</p>
                <p className="text-2xl font-bold text-slate-900">{dataClassification.reduce((a, d) => a + d.protegidos, 0).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Con Data Passport</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <Button variant={activeTab === "overview" ? "default" : "ghost"} size="sm" className={activeTab === "overview" ? "bg-blue-600" : ""} onClick={() => setActiveTab("overview")}>
          <ShieldCheck className="w-4 h-4 mr-1" /> Resumen
        </Button>
        <Button variant={activeTab === "leyes" ? "default" : "ghost"} size="sm" className={activeTab === "leyes" ? "bg-blue-600" : ""} onClick={() => setActiveTab("leyes")}>
          <Gavel className="w-4 h-4 mr-1" /> Leyes
        </Button>
        <Button variant={activeTab === "firewall" ? "default" : "ghost"} size="sm" className={activeTab === "firewall" ? "bg-blue-600" : ""} onClick={() => setActiveTab("firewall")}>
          <ShieldAlert className="w-4 h-4 mr-1" /> Legal Firewall
        </Button>
        <Button variant={activeTab === "data" ? "default" : "ghost"} size="sm" className={activeTab === "data" ? "bg-blue-600" : ""} onClick={() => setActiveTab("data")}>
          <Fingerprint className="w-4 h-4 mr-1" /> Datos
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Estado de Cumplimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leyes.map((ley) => (
                  <div key={ley.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-bold text-slate-900">{ley.nombre}</span>
                        <span className="text-xs text-slate-400">{ley.titulo}</span>
                      </div>
                      <Badge className={ley.cumplimiento >= 95 ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                        {ley.cumplimiento}%
                      </Badge>
                    </div>
                    <Progress value={ley.cumplimiento} className="h-1.5" />
                    <p className="text-xs text-slate-600 mt-2">{ley.descripcion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  Legal Firewall — Reglas Activas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {firewallRules.map((rule) => (
                  <div key={rule.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Activa
                        </Badge>
                        <span className="text-sm font-bold text-slate-900">{rule.nombre}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${rule.impacto === "high" ? "text-red-700 border-red-200" : rule.impacto === "medium" ? "text-amber-700 border-amber-200" : "text-blue-700 border-blue-200"}`}>
                        Impacto: {rule.impacto}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">{rule.descripcion}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-emerald-600 font-medium">{rule.prevenciones} prevenidas</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{rule.activaciones} activaciones</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "leyes" && (
        <div className="space-y-4">
          {leyes.map((ley) => (
            <Card key={ley.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-base">{ley.nombre} — {ley.titulo}</CardTitle>
                  </div>
                  <Badge className={ley.cumplimiento >= 95 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {ley.cumplimiento}% Cumplido
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700">{ley.descripcion}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Requisitos clave:</p>
                  <div className="space-y-1">
                    {ley.requisitos.map((req, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={ley.cumplimiento} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "firewall" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-4 text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-700">{totalPrevenciones}</p>
                <p className="text-sm text-emerald-600 font-medium">Violaciones prevenidas</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-700">{totalActivaciones}</p>
                <p className="text-sm text-blue-600 font-medium">Reglas activadas</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4 text-center">
                <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-700">100%</p>
                <p className="text-sm text-purple-600 font-medium">Cobertura de protección</p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regla</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Prevenidas</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firewallRules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-sm">{rule.nombre}</TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-xs">{rule.descripcion}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${rule.impacto === "high" ? "text-red-700 border-red-200" : rule.impacto === "medium" ? "text-amber-700 border-amber-200" : "text-blue-700 border-blue-200"}`}>
                      {rule.impacto}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-emerald-700">{rule.prevenciones}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Activa
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === "data" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                Clasificación de Datos y Protección
              </CardTitle>
              <CardDescription>Todos los datos tienen Data Passport con nivel de sensibilidad y reglas de protección</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Dato</TableHead>
                    <TableHead>Ejemplos</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Casos</TableHead>
                    <TableHead>Protegidos</TableHead>
                    <TableHead>Cobertura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataClassification.map((dc) => (
                    <TableRow key={dc.type} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-sm">{dc.type}</TableCell>
                      <TableCell className="text-sm text-slate-600">{dc.ejemplos}</TableCell>
                      <TableCell>
                        <Badge className={dc.nivel === "high" ? "bg-red-100 text-red-800 text-[10px]" : dc.nivel === "medium" ? "bg-amber-100 text-amber-800 text-[10px]" : "bg-blue-100 text-blue-800 text-[10px]"}>
                          {dc.nivel === "high" ? "Alta" : dc.nivel === "medium" ? "Media" : "Baja"}
                        </Badge>
                      </TableCell>
                      <TableCell>{dc.casos.toLocaleString()}</TableCell>
                      <TableCell>{dc.protegidos.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={(dc.protegidos / dc.casos) * 100} className="w-16 h-1.5" />
                          <span className="text-xs font-bold">{Math.round((dc.protegidos / dc.casos) * 100)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}