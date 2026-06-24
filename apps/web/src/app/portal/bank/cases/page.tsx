"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Loader2, AlertTriangle } from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(value);
};

interface CaseItem {
  id: string;
  caseNumber: string;
  status: string;
  totalBalance: number;
  scoreDocumental: number | null;
  scoreRecoverability: number | null;
  scoreContactability: number | null;
  scoreRisk: number | null;
  nextAction: string | null;
  debtor: {
    firstName: string;
    lastName: string;
    idNumber: string;
  };
  products: { productType: string }[];
  agreements: { status: string }[];
}

const filters = ["Todos", "Activos", "Con Acuerdo", "En Disputa", "Cerrados"] as const;
type Filter = (typeof filters)[number];

function getAgreementLabel(caseItem: CaseItem) {
  const hasActive = caseItem.agreements?.some((a) => a.status === "ACTIVE" || a.status === "APPROVED");
  const hasPending = caseItem.agreements?.some((a) => a.status === "PENDING_APPROVAL" || a.status === "DRAFT");
  if (hasActive) return { label: "Activo", className: "bg-emerald-50 text-emerald-700" };
  if (hasPending) return { label: "Pendiente", className: "bg-indigo-50 text-indigo-700" };
  return { label: "Sin acuerdo", className: "bg-slate-100 text-slate-600" };
}

export default function BankCasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = React.useState<Filter>("Todos");
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    apiClient
      .get<CaseItem[]>("/cases")
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error cargando casos");
        setLoading(false);
      });
  }, []);

  const filteredCases = React.useMemo(() => {
    let result = [...cases];
    if (activeFilter === "Activos") {
      result = result.filter((c) => c.status === "ACTIVE");
    } else if (activeFilter === "Con Acuerdo") {
      result = result.filter((c) => c.agreements && c.agreements.length > 0);
    } else if (activeFilter === "En Disputa") {
      result = result.filter((c) => c.status === "BLOCKED");
    } else if (activeFilter === "Cerrados") {
      result = result.filter((c) => c.status === "CLOSED");
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          `${c.debtor.firstName} ${c.debtor.lastName}`.toLowerCase().includes(q) ||
          c.caseNumber.toLowerCase().includes(q) ||
          c.debtor.idNumber.toLowerCase().includes(q) ||
          c.products?.[0]?.productType?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchTerm, cases]);

  const stats = {
    total: filteredCases.length,
    active: filteredCases.filter((c) => c.status === "ACTIVE").length,
    withAgreement: filteredCases.filter((c) => c.agreements && c.agreements.length > 0).length,
    disputed: filteredCases.filter((c) => c.status === "BLOCKED").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Casos del Banco</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista de todos los casos derivados de las carteras gestionadas por su institución.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, ID o producto..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none ring-indigo-200 transition focus:border-indigo-500 focus:ring-2"
            />
            <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeFilter === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total casos", value: stats.total },
            { label: "Activos", value: stats.active },
            { label: "Con acuerdo", value: stats.withAgreement },
            { label: "En disputa", value: stats.disputed },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">{stat.value.toLocaleString("es-DO")}</p>
            </div>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Producto</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Acuerdo</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCases.map((item) => {
                const debtorName = `${item.debtor.firstName} ${item.debtor.lastName}`;
                const productType = item.products[0]?.productType || "N/A";
                const agreement = getAgreementLabel(item);
                const score = item.scoreRecoverability ?? 0;
                return (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{debtorName}</span>
                        <span className="text-xs text-slate-500">{item.caseNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                        {productType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                      {formatCurrency(item.totalBalance)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "BLOCKED"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${agreement.className}`}>
                        {agreement.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ScoreBar score={score} />
                    </td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
                    No hay casos para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {filteredCases.map((item) => {
            const debtorName = `${item.debtor.firstName} ${item.debtor.lastName}`;
            const productType = item.products[0]?.productType || "N/A";
            const agreement = getAgreementLabel(item);
            const score = item.scoreRecoverability ?? 0;
            return (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-bold text-slate-900">{debtorName}</p>
                    <p className="text-xs text-slate-500">{item.caseNumber}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    {productType}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Saldo</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">{formatCurrency(item.totalBalance)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Score</p>
                    <div className="mt-0.5">
                      <ScoreBar score={score} compact />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "BLOCKED"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {item.status}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${agreement.className}`}>
                    {agreement.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium text-slate-900">{filteredCases.length}</span> de{" "}
            <span className="font-medium text-slate-900">{cases.length}</span> casos
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ score, compact }: { score: number; compact?: boolean }) {
  const colorClass =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
      ? "bg-indigo-500"
      : score >= 40
      ? "bg-amber-500"
      : "bg-rose-500";

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full ${colorClass}`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs font-semibold text-slate-700">{score}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${colorClass}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700">{score}</span>
    </div>
  );
}
