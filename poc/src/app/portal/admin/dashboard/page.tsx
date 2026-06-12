"use client";

import {
  DollarSign,
  TrendingUp,
  Users,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Scale,
  Lock,
  Eye,
  Zap,
  BarChart3,
  Activity,
  Shield,
  Target,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { demoCases, demoKPIs, demoCommunications, demoAuditLog, formatCurrency, formatDate } from "@/lib/seed-data";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const recoveryData = [
  { month: "Ene", recuperado: 4200000, costo: 800000, neto: 3400000 },
  { month: "Feb", recuperado: 5100000, costo: 900000, neto: 4200000 },
  { month: "Mar", recuperado: 6300000, costo: 1100000, neto: 5200000 },
  { month: "Abr", recuperado: 5800000, costo: 1000000, neto: 4800000 },
  { month: "May", recuperado: 7200000, costo: 1200000, neto: 6000000 },
  { month: "Jun", recuperado: 8500000, costo: 1300000, neto: 7200000 },
];

const channelData = [
  { name: "Portal", value: 35, color: "#10b981", costo: 5, conversion: 25 },
  { name: "Email", value: 28, color: "#3b82f6", costo: 12, conversion: 18 },
  { name: "Llamada", value: 22, color: "#f59e0b", costo: 45, conversion: 22 },
  { name: "SMS", value: 10, color: "#8b5cf6", costo: 25, conversion: 8 },
  { name: "WhatsApp", value: 5, color: "#06b6d4", costo: 15, conversion: 12 },
];

const scoreDistribution = [
  { range: "90-100", count: 120, color: "#10b981" },
  { range: "70-89", count: 340, color: "#22c55e" },
  { range: "50-69", count: 280, color: "#f59e0b" },
  { range: "30-49", count: 310, color: "#f97316" },
  { range: "0-29", count: 150, color: "#ef4444" },
];

const complianceData = [
  { name: "Cumple", value: 94, color: "#10b981" },
  { name: "Restringido", value: 4, color: "#f59e0b" },
  { name: "Bloqueado", value: 2, color: "#ef4444" },
];

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  disputed: "bg-red-100 text-red-800 border-red-200",
  restricted: "bg-amber-100 text-amber-800 border-amber-200",
  blocked: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusLabel: Record<string, string> = {
  active: "Activo",
  disputed: "En Disputa",
  restricted: "Restringido",
  blocked: "Bloqueado",
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const blockedCount = demoCommunications.filter((c) => c.status === "blocked").length;
  const totalComms = demoCommunications.length;
  const complianceRate = 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel Ejecutivo</h1>
          <p className="text-sm text-slate-500 mt-1">
            Banco Popular Dominicano · Cartera Junio 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Legal Firewall Activo
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Data Passport
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Scale className="w-3 h-3 mr-1" />
            Ley 172-13
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cartera Asignada</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(demoKPIs.portfolioAssigned)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-500">{demoKPIs.activeCases} casos</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-emerald-600 font-medium">{demoKPIs.casesWithAgreement} con acuerdo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Recuperado (Mes)</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(demoKPIs.recoveredThisMonth)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">+18.5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Recuperación Neta</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(demoKPIs.netRecovery)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Margen neto</span>
                <span className="text-xs font-bold text-amber-700">72.9%</span>
              </div>
              <Progress value={72.9} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Legal Firewall</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{demoKPIs.firewallBlocked} protecciones</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">0 violaciones Ley 172-13</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Conversión</p>
              <p className="text-lg font-bold text-slate-900">{demoKPIs.conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Costo/Contacto</p>
              <p className="text-lg font-bold text-slate-900">${demoKPIs.costPerContact}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Disputas</p>
              <p className="text-lg font-bold text-slate-900">{demoCases.filter(c => c.status === "disputed").length} activas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Cumplimiento</p>
              <p className="text-lg font-bold text-emerald-600">{complianceRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Recuperación Neta Mensual
            </CardTitle>
            <CardDescription>Recuperado, costo y margen neto (últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="colorRecuperado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNeto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                  <Legend />
                  <Area type="monotone" dataKey="recuperado" stroke="#10b981" strokeWidth={2} fill="url(#colorRecuperado)" name="Recuperado" />
                  <Area type="monotone" dataKey="neto" stroke="#3b82f6" strokeWidth={2} fill="url(#colorNeto)" name="Neto" />
                  <Bar dataKey="costo" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Costo" barSize={20} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cumplimiento Normativo
            </CardTitle>
            <CardDescription>Ley 172-13 compliance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={complianceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {complianceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-700">Cumple</span>
                </div>
                <span className="font-bold text-emerald-700">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-slate-700">Restringido</span>
                </div>
                <span className="font-bold text-amber-700">4%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-slate-700">Bloqueado</span>
                </div>
                <span className="font-bold text-red-700">2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel + Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Canales de Contacto
            </CardTitle>
            <CardDescription>Costo vs conversión por canal — No Equal Spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((ch) => (
                <div key={ch.name} className="flex items-center gap-4">
                  <div className="w-24">
                    <p className="text-sm font-medium text-slate-900">{ch.name}</p>
                    <p className="text-xs text-slate-500">{ch.value}% del total</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={ch.value} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Costo: <strong className="text-slate-700">${ch.costo}</strong></span>
                      <span>Conversión: <strong className="text-emerald-700">{ch.conversion}%</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              Distribución de Scores
            </CardTitle>
            <CardDescription>1200 casos por rango de recuperabilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="range" tick={{ fontSize: 11 }} stroke="#94a3b8" width={60} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              Expedientes Prioritarios
            </CardTitle>
            <Link href="/portal/admin/cases">
              <Button variant="outline" size="sm" className="text-xs">
                Ver todos <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deudor</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contact.</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead>Data Passport</TableHead>
                <TableHead>Próx. Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoCases.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell>
                    <Link href={`/portal/admin/cases/${c.id}`} className="hover:text-emerald-600 transition-colors">
                      <div>
                        <p className="font-medium text-slate-900">{c.debtor.name}</p>
                        <p className="text-xs text-slate-400">{c.debtor.idNumber}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{c.product}</TableCell>
                  <TableCell className="font-medium text-slate-900">{formatCurrency(c.balance)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[c.status]}>
                      {statusLabel[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {c.debtor.phone.allowed ? <Phone className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-red-400" />}
                      {c.debtor.email.allowed ? <Mail className="w-3.5 h-3.5 text-blue-500" /> : <Lock className="w-3.5 h-3.5 text-red-400" />}
                      <span className="text-xs text-slate-500">{c.scores.contactability}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.scores.risk > 70 ? "bg-red-500" : c.scores.risk > 40 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${c.scores.risk}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{c.scores.risk}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs text-slate-600">{c.dataPassport.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      {c.nextBestAction.channel === "call" && <Phone className="w-3 h-3 text-emerald-600" />}
                      {c.nextBestAction.channel === "portal" && <Mail className="w-3 h-3 text-blue-600" />}
                      {c.nextBestAction.channel === "none" && <AlertTriangle className="w-3 h-3 text-red-500" />}
                      <span className={c.nextBestAction.channel === "none" ? "text-red-600 font-medium" : "text-slate-600"}>
                        {c.nextBestAction.channel === "call" ? "Llamar" : c.nextBestAction.channel === "portal" ? "Portal" : "Pausado"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legal Firewall Activity Feed */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Legal Firewall — Protecciones Activas (Hoy)
          </CardTitle>
          <CardDescription>Cada bloqueo es una violación prevenida. Cero infracciones de Ley 172-13.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoCommunications.filter((c) => c.status === "blocked").map((comm) => {
              const caseData = demoCases.find((c) => c.id === comm.caseId);
              return (
                <div key={comm.id} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Protección Legal Firewall
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">{comm.channel}</Badge>
                    </div>
                    <p className="text-sm text-emerald-800 mt-1 font-medium">{comm.blockedReason}</p>
                    <p className="text-xs text-slate-500 mt-1">{caseData?.debtor.name} · {formatDate(comm.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Audit */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-600" />
              Auditoría Reciente
            </CardTitle>
            <Link href="/portal/admin/audit">
              <Button variant="outline" size="sm" className="text-xs">
                Ver todo <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoAuditLog.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 text-sm">
                {entry.result === "allowed" || entry.result === "auto-logged" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Shield className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <span className="text-slate-900 flex-1">{entry.action}</span>
                <Badge variant="outline" className={`text-[10px] ${entry.result === "allowed" ? "text-emerald-700 border-emerald-200" : entry.result === "blocked" || entry.result === "auto-blocked" ? "text-amber-700 border-amber-200" : "text-blue-700 border-blue-200"}`}>
                  {entry.result === "allowed" ? "Permitido" : entry.result === "blocked" ? "Protegido" : entry.result === "auto-blocked" ? "Auto-protegido" : "Auto"}
                </Badge>
                <span className="text-xs text-slate-400 flex-shrink-0">{entry.user}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}