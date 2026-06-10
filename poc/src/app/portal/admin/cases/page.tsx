"use client";

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
import { demoCases, formatCurrency } from "@/lib/seed-data";

const statusLabels: Record<string, string> = {
  active: "Activo",
  disputed: "En Disputa",
  restricted: "Restringido",
  blocked: "Bloqueado",
  closed: "Cerrado",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500",
  disputed: "bg-red-500",
  restricted: "bg-amber-500",
  blocked: "bg-slate-500",
  closed: "bg-blue-500",
};

export default function CasesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expedientes</h1>
          <p className="text-slate-500 mt-1">
            {demoCases.length} expedientes activos en la cartera
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
        {demoCases.map((c) => (
          <Link key={c.id} href={`/portal/admin/cases/${c.id}`}>
            <Card className="hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-16 rounded-full ${statusColors[c.status]}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{c.debtor.name}</h3>
                        <Badge
                          className={
                            c.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : c.status === "disputed"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }
                        >
                          {statusLabels[c.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {c.debtor.idNumber} · {c.product}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-400">
                          Fuente dato: {c.dataPassport.source}
                        </span>
                        <span className="text-xs text-slate-300">|</span>
                        <span className="text-xs text-slate-400">
                          Base legal: {c.dataPassport.legalBasis}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(c.balance)}
                      </p>
                      <p className="text-xs text-slate-500">Saldo</p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {(["documental", "recoverability", "contactability", "risk"] as const).map(
                        (key) => {
                          const val = c.scores[key];
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
                              <p className="text-[10px] text-slate-500 mt-1">
                                {label}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {c.debtor.phone.allowed ? (
                        <Phone className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-red-400" />
                      )}
                      {c.debtor.email.allowed ? (
                        <Mail className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}