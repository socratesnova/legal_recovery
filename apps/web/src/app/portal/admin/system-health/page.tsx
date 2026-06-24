"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Server,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Wifi,
} from "lucide-react";

const responseTimeData = [
  { time: "00:00", avg: 110, p95: 250 },
  { time: "04:00", avg: 105, p95: 240 },
  { time: "08:00", avg: 130, p95: 310 },
  { time: "12:00", avg: 125, p95: 290 },
  { time: "16:00", avg: 115, p95: 270 },
  { time: "20:00", avg: 120, p95: 280 },
];

const statusCards = [
  {
    title: "Frontend Next.js",
    status: "Healthy",
    icon: Server,
    details: ["Uptime 99.9%", "3 replicas"],
  },
  {
    title: "API NestJS",
    status: "Healthy",
    icon: Server,
    details: ["Uptime 99.8%", "3 replicas"],
  },
  {
    title: "PostgreSQL",
    status: "Healthy",
    icon: Database,
    details: ["Connections 45/100", "2.1GB data"],
  },
  {
    title: "Redis",
    status: "Healthy",
    icon: Activity,
    details: ["Memory 156MB", "1,200 keys"],
  },
  {
    title: "MinIO S3",
    status: "Healthy",
    icon: HardDrive,
    details: ["4.2GB stored", "2,400 objects"],
  },
  {
    title: "AI Service",
    status: "Healthy",
    icon: Wifi,
    details: ["Uptime 99.5%", "12 models loaded"],
  },
];

const alerts = [
  { level: "info", message: "Auto-scaling triggered: API replicas 2 → 3", time: "10 min ago" },
  { level: "info", message: "Database vacuum completed", time: "1 h ago" },
  { level: "warning", message: "AI service latency spike > 500ms", time: "2 h ago" },
  { level: "info", message: "Nightly backup completed successfully", time: "6 h ago" },
  { level: "resolved", message: "MinIO temporary unreachable — resolved", time: "8 h ago" },
];

const resourceBars = [
  { label: "CPU", value: 45 },
  { label: "Memory", value: 62 },
  { label: "Disk", value: 38 },
  { label: "Network", value: 55 },
];

export default function SystemHealthPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">
              Salud del Sistema
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              Monitoreo de infraestructura, rendimiento y disponibilidad
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Activity className="mr-2 h-4 w-4" />
              Refrescar
            </Button>
            <Button
              variant="outline"
              className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* System status cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statusCards.map((card) => (
            <Card key={card.title} className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-slate-800">
                  {card.title}
                </CardTitle>
                <card.icon className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700">
                    {card.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.details.map((detail) => (
                    <Badge
                      key={detail}
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {detail}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance metrics */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Rendimiento — últimas 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Tiempo de respuesta</p>
                <p className="text-lg font-bold text-emerald-900">avg 120ms</p>
                <p className="text-xs text-slate-600">p95 280ms</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Solicitudes / seg</p>
                <p className="text-lg font-bold text-emerald-900">450 req/s</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Tasa de error</p>
                <p className="text-lg font-bold text-emerald-900">0.02%</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    name="Avg (ms)"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#059669" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p95"
                    name="p95 (ms)"
                    stroke="#0f766e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: "#0f766e" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Alert log + Resource usage */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Alert log */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-800">
                Registro de Alertas
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, index) => {
                const colorMap = {
                  info: "bg-sky-50 text-sky-700 border-sky-200",
                  warning: "bg-amber-50 text-amber-700 border-amber-200",
                  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
                };
                return (
                  <div
                    key={index}
                    className={`flex items-start justify-between rounded-md border p-3 ${colorMap[alert.level as keyof typeof colorMap]}`}
                  >
                    <div className="flex items-start gap-2">
                      {alert.level === "info" && (
                        <Activity className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      {alert.level === "warning" && (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      {alert.level === "resolved" && (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <span className="shrink-0 text-xs opacity-80">
                      {alert.time}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Resource usage */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-800">
                Uso de Recursos
              </CardTitle>
              <Server className="h-5 w-5 text-slate-500" />
            </CardHeader>
            <CardContent className="space-y-5">
              {resourceBars.map((res) => (
                <div key={res.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {res.label}
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {res.value}%
                    </span>
                  </div>
                  <Progress
                    value={res.value}
                    className="h-2 bg-slate-200"
                    // Recharts styling not used here; we rely on default shadcn + override via style if needed.
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Backup status */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">
              Estado de Respaldo
            </CardTitle>
            <HardDrive className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Último respaldo</p>
                <p className="text-lg font-bold text-emerald-900">6 h atrás</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Próximo respaldo</p>
                <p className="text-lg font-bold text-emerald-900">En 18 h</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Tamaño</p>
                <p className="text-lg font-bold text-emerald-900">1.8 GB</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
                <HardDrive className="mr-2 h-4 w-4" />
                Respaldar ahora
              </Button>
              <Button
                variant="outline"
                className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
              >
                Ver historial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
