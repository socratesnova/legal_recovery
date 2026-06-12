"use client";

import * as React from "react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(value);
};

interface CaseItem {
  id: string;
  name: string;
  product: string;
  balance: number;
  status: "Active" | "Disputed" | "Closed";
  agreement: "Yes" | "No" | "Pending" | "Paid";
  score: number;
}

const demoCases: CaseItem[] = [
  {
    id: "BPD-2024-0001",
    name: "Juan Pérez",
    product: "Tarjeta",
    balance: 125000,
    status: "Active",
    agreement: "Yes",
    score: 82,
  },
  {
    id: "BPD-2024-0002",
    name: "María García",
    product: "Préstamo",
    balance: 89000,
    status: "Active",
    agreement: "No",
    score: 45,
  },
  {
    id: "BPD-2024-0003",
    name: "Pedro Martínez",
    product: "Tarjeta",
    balance: 250000,
    status: "Disputed",
    agreement: "No",
    score: 75,
  },
  {
    id: "BPD-2024-0004",
    name: "Ana López",
    product: "Vehículo",
    balance: 180000,
    status: "Active",
    agreement: "Pending",
    score: 68,
  },
  {
    id: "BPD-2024-0005",
    name: "Carlos Ruiz",
    product: "Hipoteca",
    balance: 1200000,
    status: "Active",
    agreement: "No",
    score: 55,
  },
  {
    id: "BPD-2024-0006",
    name: "Laura Santos",
    product: "Tarjeta",
    balance: 45000,
    status: "Closed",
    agreement: "Paid",
    score: 95,
  },
];

const filters = ["Todos", "Activos", "Con Acuerdo", "En Disputa", "Cerrados"] as const;
type Filter = (typeof filters)[number];

function getAgreementLabel(agreement: CaseItem["agreement"]) {
  switch (agreement) {
    case "Yes":
      return "Activo";
    case "No":
      return "Sin acuerdo";
    case "Pending":
      return "Pendiente";
    case "Paid":
      return "Pagado";
    default:
      return agreement;
  }
}

export default function BankCasesPage() {
  const [activeFilter, setActiveFilter] = React.useState<Filter>("Todos");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCases = React.useMemo(() => {
    let result = demoCases;
    if (activeFilter === "Activos") {
      result = result.filter((c) => c.status === "Active");
    } else if (activeFilter === "Con Acuerdo") {
      result = result.filter((c) => c.agreement === "Yes" || c.agreement === "Pending" || c.agreement === "Paid");
    } else if (activeFilter === "En Disputa") {
      result = result.filter((c) => c.status === "Disputed");
    } else if (activeFilter === "Cerrados") {
      result = result.filter((c) => c.status === "Closed");
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.product.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchTerm]);

  const stats = {
    total: filteredCases.length,
    active: filteredCases.filter((c) => c.status === "Active").length,
    withAgreement: filteredCases.filter(
      (c) => c.agreement === "Yes" || c.agreement === "Pending"
    ).length,
    disputed: filteredCases.filter((c) => c.status === "Disputed").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Casos del Banco</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista de todos los casos derivados de las carteras gestionadas por su institución.
          </p>
        </div>

        {/* Search + Filters */}
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

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total casos", value: stats.total },
            { label: "Activos", value: stats.active },
            { label: "Con acuerdo", value: stats.withAgreement },
            { label: "En disputa", value: stats.disputed },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">
                {stat.value.toLocaleString("es-DO")}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Producto
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Saldo
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Acuerdo
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCases.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500">{item.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                      {item.product}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                    {formatCurrency(item.balance)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "Disputed"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.agreement === "Yes"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.agreement === "Pending"
                          ? "bg-indigo-50 text-indigo-700"
                          : item.agreement === "Paid"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getAgreementLabel(item.agreement)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBar score={item.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.id}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {item.product}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Saldo
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {formatCurrency(item.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Score
                  </p>
                  <div className="mt-0.5">
                    <ScoreBar score={item.score} compact />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "Disputed"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.agreement === "Yes"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.agreement === "Pending"
                      ? "bg-indigo-50 text-indigo-700"
                      : item.agreement === "Paid"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {getAgreementLabel(item.agreement)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination visual */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium text-slate-900">{filteredCases.length}</span> de{" "}
            <span className="font-medium text-slate-900">1,200</span> casos
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40" disabled>
              Anterior
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40" disabled>
              Siguiente
            </button>
          </div>
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
          <div
            className={`h-full ${colorClass}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-700">{score}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700">{score}</span>
    </div>
  );
}
