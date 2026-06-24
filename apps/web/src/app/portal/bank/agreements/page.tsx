"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Eye,
  Filter,
  ChevronRight,
  TrendingDown,
  CalendarDays,
  CreditCard,
  Ban,
  Loader2,
  AlertTriangle,
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
import { apiClient } from "@/lib/api-client";

interface Agreement {
  id: string;
  caseId: string;
  type: string;
  amount: number;
  discountPercentage: number | null;
  installments: number | null;
  status: string;
  createdAt: string;
  case?: {
    caseNumber: string;
    debtor?: {
      firstName: string;
      lastName: string;
      idNumber: string;
    };
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(value);
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  ACTIVE: {
    label: "Activo",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  APPROVED: {
    label: "Aprobado",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  PENDING_APPROVAL: {
    label: "Pendiente",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <Clock className="w-3 h-3" />,
  },
  DRAFT: {
    label: "Borrador",
    color: "bg-slate-100 text-slate-800 border-slate-200",
    icon: <Clock className="w-3 h-3" />,
  },
  COMPLETED: {
    label: "Completado",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <Ban className="w-3 h-3" />,
  },
  REJECTED: {
    label: "Rechazado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <Ban className="w-3 h-3" />,
  },
};

const filters = [
  { key: "all", label: "Todos" },
  { key: "ACTIVE", label: "Activos" },
  { key: "PENDING_APPROVAL", label: "Pendientes" },
  { key: "COMPLETED", label: "Completados" },
  { key: "CANCELLED", label: "Cancelados" },
];

export default function BankAgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    apiClient
      .get<Agreement[]>("/agreements")
      .then((data) => {
        setAgreements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error cargando acuerdos");
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "all"
      ? agreements
      : agreements.filter((a) => a.status === filter);

  const total = agreements.length;
  const active = agreements.filter((a) => a.status === "ACTIVE" || a.status === "APPROVED").length;
  const pending = agreements.filter((a) => a.status === "PENDING_APPROVAL" || a.status === "DRAFT").length;
  const completed = agreements.filter((a) => a.status === "COMPLETED").length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Acuerdos de Pago</h1>
            <p className="text-sm text-slate-500">
              Todos los acuerdos generados sobre casos de Banco Popular Dominicano
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Todos los acuerdos validados por Legal Firewall
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Total Acuerdos</p>
                <p className="text-2xl font-bold text-slate-900">{total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Activos</p>
                <p className="text-2xl font-bold text-slate-900">{active}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-slate-900">{pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Completados</p>
                <p className="text-2xl font-bold text-slate-900">{completed}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {filters.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.key)}
            className={
              filter === f.key
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "text-slate-600 border-slate-200 hover:bg-slate-50"
            }
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Listado de Acuerdos
          </CardTitle>
          <CardDescription>
            {filtered.length} acuerdo{filtered.length !== 1 ? "s" : ""} mostrado{filtered.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="text-left font-medium text-slate-600 px-6 py-3">Deudor / Caso</th>
                  <th className="text-left font-medium text-slate-600 px-6 py-3">Tipo</th>
                  <th className="text-left font-medium text-slate-600 px-6 py-3">Descuento</th>
                  <th className="text-left font-medium text-slate-600 px-6 py-3">Monto</th>
                  <th className="text-left font-medium text-slate-600 px-6 py-3">Cuotas</th>
                  <th className="text-left font-medium text-slate-600 px-6 py-3">Estado</th>
                  <th className="text-right font-medium text-slate-600 px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((agr) => {
                  const s = statusConfig[agr.status] || statusConfig["DRAFT"];
                  const debtorName = agr.case?.debtor
                    ? `${agr.case.debtor.firstName} ${agr.case.debtor.lastName}`
                    : "Desconocido";
                  return (
                    <tr key={agr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{debtorName}</p>
                          <p className="text-xs text-slate-500">{agr.case?.caseNumber || agr.caseId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-600 capitalize">{agr.type.toLowerCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {agr.discountPercentage ?? 0}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {formatCurrency(Number(agr.amount))}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {agr.installments ?? 1}x
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`${s.color} font-medium text-[11px] flex items-center gap-1 w-fit`}>
                          {s.icon}
                          {s.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalle
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-500 text-sm">
                      No hay acuerdos para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((agr) => {
              const s = statusConfig[agr.status] || statusConfig["DRAFT"];
              const debtorName = agr.case?.debtor
                ? `${agr.case.debtor.firstName} ${agr.case.debtor.lastName}`
                : "Desconocido";
              return (
                <div key={agr.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{debtorName}</p>
                      <p className="text-xs text-slate-500">{agr.case?.caseNumber || agr.caseId}</p>
                    </div>
                    <Badge variant="outline" className={`${s.color} font-medium text-[11px] flex items-center gap-1 shrink-0`}>
                      {s.icon}
                      {s.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-center">
                      <p className="text-[10px] text-slate-500 uppercase">Descuento</p>
                      <p className="text-sm font-bold text-emerald-700">{agr.discountPercentage ?? 0}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-50 text-center">
                      <p className="text-[10px] text-indigo-500 uppercase">Monto</p>
                      <p className="text-sm font-bold text-indigo-900">{formatCurrency(Number(agr.amount))}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 text-center">
                      <p className="text-[10px] text-slate-500 uppercase">Cuotas</p>
                      <p className="text-sm font-bold text-slate-700">{agr.installments ?? 1}x</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(agr.createdAt).toLocaleDateString("es-DO")}
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 h-8">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-slate-500 text-sm">
                No hay acuerdos para este filtro.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
