"use client";

import {
  DollarSign,
  TrendingUp,
  Users,
  ShieldAlert,
  Phone,
  Mail,
  MessageSquare,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
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
import Link from "next/link";
import { demoCases, demoKPIs, demoCommunications, formatCurrency } from "@/lib/seed-data";
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
} from "recharts";

const recoveryData = [
  { month: "Ene", recuperado: 4200000, costo: 800000 },
  { month: "Feb", recuperado: 5100000, costo: 900000 },
  { month: "Mar", recuperado: 6300000, costo: 1100000 },
  { month: "Abr", recuperado: 5800000, costo: 1000000 },
  { month: "May", recuperado: 7200000, costo: 1200000 },
  { month: "Jun", recuperado: 8500000, costo: 1300000 },
];

const channelData = [
  { name: "Portal", value: 35, color: "#10b981" },
  { name: "Email", value: 28, color: "#3b82f6" },
  { name: "Call", value: 22, color: "#f59e0b" },
  { name: "SMS", value: 10, color: "#8b5cf6" },
  { name: "WhatsApp", value: 5, color: "#06b6d4" },
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

  const blockedCount = demoCommunications.filter(
    (c) => c.status === "blocked"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Panel Ejecutivo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Banco Popular Dominicano · Cartera Junio 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Legal Firewall Activo
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Data Passport Habilitado
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Cartera Asignada
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(demoKPIs.portfolioAssigned)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {demoKPIs.activeCases} casos activos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Recuperado (Mes)
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(demoKPIs.recoveredThisMonth)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +18.5% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Recuperación Neta
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(demoKPIs.netRecovery)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {demoKPIs.casesWithAgreement} acuerdos vigentes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Legal Firewall
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {demoKPIs.firewallBlocked} bloqueos
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              0 violaciones de Ley 172-13
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Cases Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recuperación Mensual</CardTitle>
            <CardDescription>
              Recuperado vs. Costo de gestión (últimos 6 meses)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recoveryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
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
                  <Bar dataKey="recuperado" fill="#10b981" radius={[4, 4, 0, 0]} name="Recuperado" />
                  <Bar dataKey="costo" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Costo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Canales de Contacto</CardTitle>
            <CardDescription>Distribución por canal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {channelData.map((ch) => (
                <div
                  key={ch.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span className="text-slate-600">{ch.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">{ch.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Expedientes Recientes</CardTitle>
            <Link href="/portal/admin/cases">
              <Button variant="outline" size="sm" className="text-xs">
                Ver todos
                <ArrowUpRight className="w-3 h-3 ml-1" />
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
                <TableHead>Contactabilidad</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead>Próx. Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoCases.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell>
                    <Link
                      href={`/portal/admin/cases/${c.id}`}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {c.debtor.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {c.debtor.idNumber}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {c.product}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {formatCurrency(c.balance)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColor[c.status]}
                    >
                      {statusLabel[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {c.debtor.phone.allowed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {c.scores.contactability}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.scores.risk > 70
                              ? "bg-red-500"
                              : c.scores.risk > 40
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${c.scores.risk}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {c.scores.risk}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {c.nextBestAction.channel === "call" && (
                        <Phone className="w-3 h-3" />
                      )}
                      {c.nextBestAction.channel === "portal" && (
                        <Mail className="w-3 h-3" />
                      )}
                      {c.nextBestAction.channel === "none" && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      {c.nextBestAction.channel === "call" && "Llamar"}
                      {c.nextBestAction.channel === "portal" && "Portal"}
                      {c.nextBestAction.channel === "none" && "Pausado"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Firewall Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            Eventos del Legal Firewall (Hoy)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoCommunications
              .filter((c) => c.status === "blocked")
              .map((comm) => (
                <div
                  key={comm.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                >
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-800">
                        {comm.channel.toUpperCase()} bloqueado
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-red-600 border-red-200"
                      >
                        Legal Firewall
                      </Badge>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      {comm.blockedReason}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {new Date(comm.timestamp).toLocaleTimeString("es-DO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}