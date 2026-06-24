"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(amount);
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  RESTRICTED: "Restringido",
  BLOCKED: "Bloqueado",
  CLOSED: "Cerrado",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  RESTRICTED: "bg-amber-500",
  BLOCKED: "bg-slate-500",
  CLOSED: "bg-blue-500",
};

const statusBadgeClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  RESTRICTED: "bg-amber-50 text-amber-700",
  BLOCKED: "bg-slate-50 text-slate-700",
  CLOSED: "bg-blue-50 text-blue-700",
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
}

export default function CasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<CaseItem[]>("/cases")
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error cargando expedientes");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expedientes</h1>
          <p className="text-slate-500 mt-1">
            {cases.length} expedientes activos en la cartera
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar expediente..."
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {cases.map((c) => {
          const debtorName = `${c.debtor.firstName} ${c.debtor.lastName}`;
          const productType = c.products[0]?.productType || "N/A";
          const scores = {
            documental: c.scoreDocumental ?? 0,
            recoverability: c.scoreRecoverability ?? 0,
            contactability: c.scoreContactability ?? 0,
            risk: c.scoreRisk ?? 0,
          };

          return (
            <Link key={c.id} href={`/portal/admin/cases/${c.id}`}>
              <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-16 rounded-full ${statusColors[c.status] || "bg-slate-300"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{debtorName}</h3>
                          <Badge className={statusBadgeClasses[c.status] || "bg-slate-50 text-slate-700"}>
                            {statusLabels[c.status] || c.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {c.debtor.idNumber} · {productType}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-400">
                            Expediente: {c.caseNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xl font-bold text-slate-900">
                          {formatCurrency(c.totalBalance)}
                        </p>
                        <p className="text-xs text-slate-500">Saldo</p>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {(["documental", "recoverability", "contactability", "risk"] as const).map(
                          (key) => {
                            const val = scores[key];
                            const label =
                              key === "documental"
                                ? "Doc"
                                : key === "recoverability"
                                  ? "Recup"
                                  : key === "contactability"
                                    ? "Contact"
                                    : "Riesgo";
                            return (
                              <div key={key} className="text-center">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                                    val >= 70
                                      ? "bg-emerald-50 text-emerald-600"
                                      : val >= 40
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  <span className="text-xs font-bold">{val}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">{label}</p>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
