"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Calendar, CheckCircle2, Clock, Download, Receipt, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Payment {
  id: string;
  amount: number;
  method: string;
  reference: string | null;
  status: string;
  createdAt: string;
  case?: {
    caseNumber: string;
    institution?: { name: string };
  };
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

export default function DebtorPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Payment[]>("/payments")
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const verifiedCount = payments.filter((p) => p.status === "RECONCILED" || p.status === "VERIFIED").length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Historial de Pagos</h1>
          <p className="text-sm text-slate-500">Registro de todos tus pagos realizados</p>
        </div>
        <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
          <CreditCard className="w-4 h-4 mr-2" /> Realizar Pago
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-slate-500">Total Pagado</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-slate-500">Pagos Realizados</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{payments.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-slate-500">Verificados</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700">{verifiedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registro de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-6">
          {payments.map((pay) => (
            <div key={pay.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{pay.case?.institution?.name || "Banco"}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3 shrink-0" /> {formatDate(pay.createdAt)} · {pay.method}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="font-bold">{formatCurrency(Number(pay.amount))}</p>
                  <Badge className={pay.status === "RECONCILED" || pay.status === "VERIFIED" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                    {pay.status === "RECONCILED" || pay.status === "VERIFIED" ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Verificado</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" /> {pay.status}</>
                    )}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Download className="w-4 h-4 mr-1" /> Recibo
                </Button>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="text-center py-8 text-slate-500">No tienes pagos registrados.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
