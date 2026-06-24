"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  DollarSign,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Building2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  Scale,
  Clock,
  Calendar,
  MessageSquare,
  Gavel,
  Fingerprint,
  Loader2,
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
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";

interface CaseItem {
  id: string;
  caseNumber: string;
  status: string;
  totalBalance: number;
  debtor: {
    firstName: string;
    lastName: string;
    idNumber: string;
  };
  products: { productType: string }[];
  agreements: { status: string; amount: number; discountPercentage: number | null; installments: number | null }[];
  payments: { amount: number; status: string }[];
  institution: { name: string };
  nextAction: string | null;
  nextActionDate: string | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DebtorDashboardPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<CaseItem[]>("/cases")
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalDebt = cases.reduce((a, c) => a + (c.totalBalance || 0), 0);
  const totalPaid = cases.reduce(
    (a, c) => a + c.payments.reduce((p, pay) => p + (pay.status !== "REJECTED" ? Number(pay.amount) : 0), 0),
    0
  );
  const activeAgreements = cases.filter((c) => c.agreements && c.agreements.length > 0).length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Mis Deudas</h1>
          <p className="text-sm text-slate-500">Resumen de todas tus obligaciones por entidad</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <Fingerprint className="w-3 h-3 mr-1" />
          {cases.length} obligaciones
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Saldo Total</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{formatCurrency(totalDebt)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{cases.length} obligaciones</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Total Pagado</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-700">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={totalDebt > 0 ? (totalPaid / (totalDebt + totalPaid)) * 100 : 0} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Acuerdos</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{activeAgreements}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{cases.filter((c) => !c.agreements?.length).length} sin acuerdo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Disputas</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-700">{cases.filter((c) => c.status === "BLOCKED").length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">En revisión</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-600" />
            Obligaciones por Entidad
          </h2>
          <Link href="/portal/debtor/institutions">
            <Button variant="ghost" size="sm" className="text-emerald-600">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {cases.map((c) => {
          const productType = c.products[0]?.productType || "N/A";
          const agreement = c.agreements[0];
          const paid = c.payments.reduce((p, pay) => p + (pay.status !== "REJECTED" ? Number(pay.amount) : 0), 0);
          const original = Number(c.totalBalance) + paid;
          const progress = original > 0 ? (paid / original) * 100 : 0;
          return (
            <Card key={c.id} className={`overflow-hidden ${c.status === "BLOCKED" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500"}`}>
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {(c.institution?.name || "BPD").slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900">{c.institution?.name || "Banco"}</p>
                          {c.status === "BLOCKED" && (
                            <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              En disputa
                            </Badge>
                          )}
                          {agreement && (
                            <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                              <FileText className="w-3 h-3 mr-1" />
                              Acuerdo activo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{productType} · {c.caseNumber}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg sm:text-xl font-bold text-slate-900">{formatCurrency(c.totalBalance)}</p>
                      <p className="text-xs text-slate-400">de {formatCurrency(original)} original</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Progreso de pago</span>
                      <span className="font-medium">{Math.round(progress)}% pagado</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Próxima acción: {c.nextAction || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">{formatDate(c.nextActionDate)}</span>
                    </div>
                  </div>

                  {agreement && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-800">
                            Acuerdo: {agreement.discountPercentage ?? 0}% descuento · {agreement.installments ?? 1} cuotas
                          </span>
                        </div>
                        <span className="text-sm font-bold text-emerald-700">
                          {formatCurrency(Number(agreement.amount))}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {!agreement && c.status !== "BLOCKED" && (
                      <Link href="/portal/debtor/agreement">
                        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                          <FileText className="w-4 h-4 mr-1" />
                          Solicitar Acuerdo
                        </Button>
                      </Link>
                    )}
                    {agreement && (
                      <Button size="sm" variant="outline">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Pagar Cuota
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Receipt className="w-4 h-4 mr-1" />
                      Estado de Cuenta
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Mensajes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {cases.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No tienes obligaciones registradas.
          </div>
        )}
      </div>

      <Card className="bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-900">¿Necesitas ayuda con tus pagos?</p>
                <p className="text-sm text-slate-500">Explora opciones de acuerdo y refinanciamiento</p>
              </div>
            </div>
            <Link href="/portal/debtor/agreements">
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                Ver opciones <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
