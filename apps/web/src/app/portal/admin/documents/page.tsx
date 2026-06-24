"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  Download,
  FileCheck,
  FileX,
  Folder,
  AlertTriangle,
  Eye,
} from "lucide-react";

const documentTypeData = [
  { type: "Contrato", complete: 82 },
  { type: "Pagaré", complete: 72 },
  { type: "Cesión", complete: 98 },
  { type: "Estado de cuenta", complete: 60 },
  { type: "Garantía", complete: 45 },
  { type: "Carta de no adeudo", complete: 100 },
];

const portfolioData = [
  {
    name: "BPD Tarjetas",
    cases: 450,
    documents: 1350,
    completeness: 90,
  },
  {
    name: "BPD Préstamos",
    cases: 320,
    documents: 960,
    completeness: 85,
  },
  {
    name: "BHD Personal",
    cases: 280,
    documents: 840,
    completeness: 78,
  },
  {
    name: "BL Hipotecas",
    cases: 150,
    documents: 750,
    completeness: 95,
  },
];

const recentDocuments = [
  {
    case: "C-2024-001",
    type: "Contrato",
    status: "complete",
    uploadedBy: "María López",
    date: "2024-06-10",
  },
  {
    case: "C-2024-002",
    type: "Pagaré",
    status: "missing",
    uploadedBy: "—",
    date: "—",
  },
  {
    case: "C-2024-003",
    type: "Cesión",
    status: "complete",
    uploadedBy: "Carlos Ruiz",
    date: "2024-06-09",
  },
  {
    case: "C-2024-004",
    type: "Estado de cuenta",
    status: "pending",
    uploadedBy: "Ana Martínez",
    date: "2024-06-08",
  },
  {
    case: "C-2024-005",
    type: "Garantía",
    status: "missing",
    uploadedBy: "—",
    date: "—",
  },
  {
    case: "C-2024-006",
    type: "Carta de no adeudo",
    status: "complete",
    uploadedBy: "Luis Gómez",
    date: "2024-06-07",
  },
];

const missingAlerts = [
  { type: "Garantía", missing: 231, impact: "Alto" },
  { type: "Estado de cuenta", missing: 300, impact: "Crítico" },
  { type: "Pagaré", missing: 249, impact: "Alto" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300",
    missing:
      "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300",
    pending:
      "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300",
  };
  const labels: Record<string, string> = {
    complete: "Completo",
    missing: "Faltante",
    pending: "Pendiente",
  };
  return (
    <Badge className={styles[status] ?? ""} variant="secondary">
      {labels[status] ?? status}
    </Badge>
  );
}

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400">
              Gestión Documental
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Repositorio central de expedientes legales
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
            >
              1,200 casos · 4,200 documentos
            </Badge>
            <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Upload className="mr-2 h-4 w-4" />
              Subir documento
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <FileText className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total documentos
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  4,200
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <FileCheck className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Completitud promedio
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  82%
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                <FileX className="h-6 w-6 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Documentos faltantes
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  756
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <Upload className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Digitalizados este mes
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  234
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts + Portfolio Status */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Completeness by Document Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Completitud por Tipo de Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={documentTypeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="type"
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Completitud"]}
                    />
                    <Bar dataKey="complete" radius={[0, 4, 4, 0]} barSize={20}>
                      {documentTypeData.map((entry, index) => {
                        const color =
                          entry.complete >= 90
                            ? "#059669"
                            : entry.complete >= 70
                              ? "#0ea5e9"
                              : entry.complete >= 50
                                ? "#f59e0b"
                                : "#ef4444";
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Document Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Estado Documental por Cartera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioData.map((portfolio) => (
                <div
                  key={portfolio.name}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {portfolio.name}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                      {portfolio.completeness}%
                    </Badge>
                  </div>
                  <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    {portfolio.cases} casos · {portfolio.documents} documentos
                  </div>
                  <Progress value={portfolio.completeness} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Documentos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Caso</th>
                    <th className="pb-3 pr-4 font-medium">Tipo</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 pr-4 font-medium">Subido por</th>
                    <th className="pb-3 pr-4 font-medium">Fecha</th>
                    <th className="pb-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocuments.map((doc) => (
                    <tr
                      key={doc.case}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                        {doc.case}
                      </td>
                      <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                        {doc.type}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                        {doc.uploadedBy}
                      </td>
                      <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                        {doc.date}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Missing Documents Alert */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Alertas de Documentos Faltantes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {missingAlerts.map((alert) => (
                <div
                  key={alert.type}
                  className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {alert.type}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    >
                      {alert.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {alert.missing} documentos faltantes
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
