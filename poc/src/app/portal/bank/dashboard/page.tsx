"use client";

import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Percent,
  Award,
  ArrowUpRight,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Briefcase,
  Bell,
  ArrowRight,
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
import { formatCurrency } from "@/lib/seed-data";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const monthlyPerformance = [
  { month: "Ene", assigned: 12000000, recovered: 5400000 },
  { month: "Feb", assigned: 8500000, recovered: 6100000 },
  { month: "Mar", assigned: 15000000, recovered: 7800000 },
  { month: "Abr", assigned: 9800000, recovered: 7200000 },
  { month: "May", assigned: 11200000, recovered: 8100000 },
  { month: "Jun", assigned: 50000000, recovered: 8500000 },
];

const conversionTrend = [
  { month: "Ene", rate: 12.4 },
  { month: "Feb", rate: 14.1 },
  { month: "Mar", rate: 15.3 },
  { month: "Abr", rate: 16.8 },
  { month: "May", rate: 17.2 },
  { month: "Jun", rate: 18.5 },
];

const topPortfolios = [
  {
    id: "pf-001",
    name: "Cartera Consumo Q2 2026",
    status: "active",
    amount: 25000000,
    recoveryPct: 34,
    quality: 92,
  },
  {
    id: "pf-002",
    name: "Tarjetas Castigadas 2025",
    status: "active",
    amount: 15000000,
    recoveryPct: 22,
    quality: 78,
  },
  {
    id: "pf-003",
    name: "Préstamos Personales",
    status: "restricted",
    amount: 7500000,
    recoveryPct: 18,
    quality: 85,
  },
  {
    id: "pf-004",
    name: "Microcréditos MYPE",
    status: "active",
    amount: 2500000,
    recoveryPct: 41,
    quality: 88,
  },
];

const alerts = [
  {
    id: 1,
    type: "dispute",
    title: "Disputa abierta",
    description:
      "Caso #003-1111111-2 — Pedro Martínez reclama deuda saldada.",
    date: "Hoy, 09:15 AM",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    id: 2,
    type: "agreement",
    title: "Acuerdo aprobado",
    description:
      "Caso #001-1234567-8 — Juan Pérez aceptó 3 cuotas con 20% descuento.",
    date: "Hoy, 08:42 AM",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: 3,
    type: "document",
    title: "Documento faltante",
    description:
      "Caso #002-7654321-0 — Falta pagaré y cesión de cartera.",
    date: "Ayer, 04:30 PM",
    icon: FileWarning,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
];

const statusColor: Record<string, string> = {
  active: "bg-indigo-100 text-indigo-800 border-indigo-200",
  restricted: "bg-amber-100 text-amber-800 border-amber-200",
  blocked: "bg-red-100 text-red-800 border-red-200",
};

const statusLabel: Record<string, string> = {
  active: "Activa",
  restricted: "Restringida",
  blocked: "Bloqueada",
};

export default function BankDashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const qualityScore = 87;
  const qualityBreakdown = {
    documental: 85,
    contactabilidad: 90,
    recuperabilidad: 82,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Institucional
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visión ejecutiva de tu cartera con Legal Recovery OS
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-indigo-50 text-indigo-700 border-indigo-200 self-start sm:self-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse" />
          Datos en tiempo real
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Saldo Asignado */}
        <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Saldo Asignado
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(50000000)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Capital total en recuperación legal
            </div>
          </CardContent>
        </Card>

        {/* Recuperado Mes */}
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Recuperado Mes
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(8500000)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">
                +11.1% vs mes anterior
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recuperación Neta */}
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Recuperación Neta
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(6200000)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Margen neto</span>
                <span className="text-xs font-bold text-blue-700">72.9%</span>
              </div>
              <Progress value={72.9} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Casos Activos */}
        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Casos Activos
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">1,200</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="font-medium text-amber-700">45</span> con acuerdo
              en vigor
            </div>
          </CardContent>
        </Card>

        {/* Tasa Conversión */}
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Tasa Conversión
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">18.5%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Promedio últimos 6 meses
            </div>
          </CardContent>
        </Card>

        {/* Calidad Cartera */}
        <Card className="border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Calidad Cartera
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {qualityScore}
                  <span className="text-sm text-slate-400 font-normal">/100</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Documental</span>
                <span className="font-medium text-slate-700">
                  {qualityBreakdown.documental}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Contactabilidad</span>
                <span className="font-medium text-slate-700">
                  {qualityBreakdown.contactabilidad}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Recuperabilidad</span>
                <span className="font-medium text-slate-700">
                  {qualityBreakdown.recuperabilidad}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Rendimiento de Cartera
            </CardTitle>
            <CardDescription>
              Monto asignado vs recuperado (últimos 6 meses)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPerformance}>
                  <defs>
                    <linearGradient
                      id="colorAssigned"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorRecovered"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="assigned"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorAssigned)"
                    name="Asignado"
                  />
                  <Area
                    type="monotone"
                    dataKey="recovered"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorRecovered)"
                    name="Recuperado"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Tendencia de Conversión
            </CardTitle>
            <CardDescription>
              Evolución de tasa de conversión (%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    domain={[0, 25]}
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#8b5cf6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                    name="Conversión"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Meta anual</span>
              <span className="font-bold text-purple-700">20.0%</span>
            </div>
            <Progress value={(18.5 / 20) * 100} className="h-1.5 mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Alerts + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              Alertas y Notificaciones
            </CardTitle>
            <CardDescription>Eventos que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${alert.bg} ${alert.border}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${alert.bg}`}
                  >
                    <alert.icon className={`w-4 h-4 ${alert.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {alert.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {alert.description}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {alert.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Portfolios Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Top Carteras
              </CardTitle>
              <Button
                size="sm"
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs"
              >
                Ver todas <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cartera</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Recuperación</TableHead>
                  <TableHead>Calidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPortfolios.map((pf) => (
                  <TableRow key={pf.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {pf.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {pf.id.toUpperCase()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColor[pf.status]}
                      >
                        {statusLabel[pf.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {formatCurrency(pf.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={pf.recoveryPct} className="w-24 h-2" />
                        <span className="text-xs text-slate-600">
                          {pf.recoveryPct}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-xs font-medium text-slate-700">
                          {pf.quality}/100
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-none">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Reporte Ejecutivo Mensual</h3>
            <p className="text-sm text-indigo-200 mt-1">
              Descarga el informe completo de recuperación, costos y
              cumplimiento normativo.
            </p>
          </div>
          <Button className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg">
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte Ejecutivo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
