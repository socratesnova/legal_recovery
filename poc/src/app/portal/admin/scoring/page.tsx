"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Mail,
  Phone,
  Scale,
  MessageSquare,
  QrCode,
  AlertTriangle,
} from "lucide-react";

const distributionData = [
  { range: "90-100", count: 45, label: "excelente" },
  { range: "80-89", count: 120, label: "bueno" },
  { range: "70-79", count: 280, label: "regular" },
  { range: "60-69", count: 350, label: "riesgo medio" },
  { range: "50-59", count: 280, label: "riesgo alto" },
  { range: "0-49", count: 125, label: "crítico" },
];

const dimensions = [
  { name: "Documental", avg: 72, weight: 30, icon: FileText, color: "bg-emerald-500" },
  { name: "Recuperabilidad", avg: 68, weight: 35, icon: Target, color: "bg-emerald-600" },
  { name: "Contactabilidad", avg: 55, weight: 20, icon: MessageSquare, color: "bg-amber-500" },
  { name: "Riesgo Legal", avg: 42, weight: 15, icon: Scale, color: "bg-rose-500" },
];

const topCases = [
  {
    name: "Carlos Ramírez",
    total: 96,
    breakdown: [94, 98, 95, 92],
    action: "Ofrecer acuerdo de pago",
  },
  {
    name: "Ana López",
    total: 93,
    breakdown: [90, 95, 88, 91],
    action: "Acuerdo de pago a 6 meses",
  },
  {
    name: "Miguel Torres",
    total: 91,
    breakdown: [88, 92, 90, 89],
    action: "Llamada directa",
  },
  {
    name: "Lucía Fernández",
    total: 89,
    breakdown: [85, 90, 87, 88],
    action: "Email + oferta",
  },
  {
    name: "Jorge Herrera",
    total: 87,
    breakdown: [82, 88, 85, 86],
    action: "Llamada + seguimiento",
  },
];

const trendData = [
  { month: "Ene", avg: 58 },
  { month: "Feb", avg: 60 },
  { month: "Mar", avg: 62 },
  { month: "Abr", avg: 63 },
  { month: "May", avg: 65 },
  { month: "Jun", avg: 67 },
];

const actionData = [
  { name: "Llamada", value: 35, color: "#059669" },
  { name: "Email", value: 25, color: "#10b981" },
  { name: "Acuerdo", value: 20, color: "#34d399" },
  { name: "Carta QR", value: 12, color: "#6ee7b7" },
  { name: "SMS", value: 5, color: "#f59e0b" },
  { name: "Judicial", value: 3, color: "#ef4444" },
];

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Motor de Scoring
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              Inteligencia artificial para priorización de casos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Brain className="mr-1 h-3.5 w-3.5" />
              AI Recovery Brain
            </Badge>
            <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Zap className="mr-2 h-4 w-4" />
              Re-entrenar modelo
            </Button>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-slate-900">
              Distribución de Casos por Rango de Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 14,
                    }}
                    formatter={(value, name, props) => [
                      `${value} casos (${props?.payload?.label})`,
                      "Casos",
                    ]}
                  />
                  <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4 Score Dimensions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            return (
              <Card key={dim.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-emerald-700" />
                    <CardTitle className="text-sm font-semibold text-slate-900">
                      {dim.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-slate-900">{dim.avg}</div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Peso</span>
                    <span className="font-medium">{dim.weight}%</span>
                  </div>
                  <Progress
                    value={dim.avg}
                    className="h-2 bg-slate-200"
                  />
                  <div className={`h-2 w-full rounded-full ${dim.color}`} style={{ width: `${dim.avg}%` }} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Top Scored Cases */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-slate-900">Casos con Mayor Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCases.map((c, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-600">{c.action}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-3 md:justify-center">
                    {c.breakdown.map((v, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="h-10 w-2 rounded bg-emerald-200">
                          <div
                            className="w-2 rounded bg-emerald-600"
                            style={{ height: `${v}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 md:w-40 md:justify-end">
                    <Badge className="bg-emerald-700 text-white">
                      {c.total}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-slate-900">Tendencia de Score Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[50, 75]} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 14,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#059669" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Next Best Action Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-slate-900">
              Distribución de Próxima Mejor Acción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="h-72 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={actionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {actionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid w-full grid-cols-2 gap-3 md:w-1/2">
                {actionData.map((item) => {
                  const IconMap: Record<string, React.ElementType> = {
                    Llamada: Phone,
                    Email: Mail,
                    Acuerdo: FileText,
                    "Carta QR": QrCode,
                    SMS: MessageSquare,
                    Judicial: AlertTriangle,
                  };
                  const Icon = IconMap[item.name] || Zap;
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-600">{item.value}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Config Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-700" />
            <CardTitle className="text-slate-900">Configuración del Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-600">Versión del modelo</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  recovery-brain-v2.3.1
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-600">Último entrenamiento</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  2025-05-14
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-600">Accuracy</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  87.4%
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-600">Umbral de revisión</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  Score &lt; 50
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
