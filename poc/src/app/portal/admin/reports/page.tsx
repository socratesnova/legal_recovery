"use client";

import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Download,
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
} from "recharts";
import { demoKPIs, formatCurrency } from "@/lib/seed-data";

const monthlyRecovery = [
  { month: "Ene", asignado: 50000000, recuperado: 4200000, costo: 800000 },
  { month: "Feb", asignado: 50000000, recuperado: 5100000, costo: 900000 },
  { month: "Mar", asignado: 50000000, recuperado: 6300000, costo: 1100000 },
  { month: "Abr", asignado: 50000000, recuperado: 5800000, costo: 1000000 },
  { month: "May", asignado: 50000000, recuperado: 7200000, costo: 1200000 },
  { month: "Jun", asignado: 50000000, recuperado: 8500000, costo: 1300000 },
];

const portfolioByBank = [
  { name: "Banco Popular", value: 20000000, color: "#10b981" },
  { name: "Banco BHD", value: 15000000, color: "#3b82f6" },
  { name: "Banco León", value: 10000000, color: "#f59e0b" },
  { name: "Scotiabank", value: 5000000, color: "#8b5cf6" },
];

const costByChannel = [
  { channel: "Portal", costo: 5, conversion: 25 },
  { channel: "Email", costo: 12, conversion: 18 },
  { channel: "Llamada", costo: 45, conversion: 22 },
  { channel: "SMS", costo: 25, conversion: 8 },
  { channel: "WhatsApp", costo: 15, conversion: 12 },
];

export default function ReportsPage() {
  const netMargin =
    ((demoKPIs.netRecovery / demoKPIs.recoveredThisMonth) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reportes y Rentabilidad
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard de rentabilidad neta por cartera
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Cartera Asignada</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(demoKPIs.portfolioAssigned)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Recuperado (Mes)</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(demoKPIs.recoveredThisMonth)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Recuperación Neta</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(demoKPIs.netRecovery)}
                </p>
              </div>
              <Target className="w-8 h-8 text-amber-200" />
            </div>
            <p className="text-xs text-emerald-600 mt-2">Margen: {netMargin}%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Costo por Contacto</p>
                <p className="text-xl font-bold text-slate-900">
                  ${demoKPIs.costPerContact}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recuperación vs Costo</CardTitle>
            <CardDescription>Evolución mensual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRecovery}>
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
                  <Legend />
                  <Bar dataKey="recuperado" fill="#10b981" name="Recuperado" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costo" fill="#f59e0b" name="Costo" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución por Banco</CardTitle>
            <CardDescription>Cartera asignada por institución</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioByBank}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {portfolioByBank.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {portfolioByBank.map((bank) => (
                <div
                  key={bank.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: bank.color }}
                    />
                    <span className="text-slate-600">{bank.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(bank.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Costo y Conversión por Canal
          </CardTitle>
          <CardDescription>
            No equal spending — cada caso tiene presupuesto basado en score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByChannel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="costo" fill="#f59e0b" name="Costo ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversion" fill="#10b981" name="Conversión (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}