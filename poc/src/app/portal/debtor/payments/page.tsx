"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Calendar, CheckCircle2, Clock, Download, Receipt } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/seed-data";

const payments = [
  { id: "pay-001", institution: "Banco Popular", amount: 33333, date: "2026-05-15", method: "Transferencia", status: "completed", receipt: "REC-001" },
  { id: "pay-002", institution: "Banco Popular", amount: 50000, date: "2026-04-10", method: "Depósito", status: "completed", receipt: "REC-002" },
  { id: "pay-003", institution: "Banco BHD", amount: 13000, date: "2026-03-20", method: "Transferencia", status: "completed", receipt: "REC-003" },
];

export default function DebtorPaymentsPage() {
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
            <p className="text-xl sm:text-2xl font-bold text-emerald-700">{formatCurrency(96333)}</p>
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
            <p className="text-xs text-slate-500">Próximo Pago</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700">RD$33,333</p>
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
                  <p className="font-medium text-sm truncate">{pay.institution}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3 shrink-0" /> {formatDate(pay.date)} · {pay.method}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="font-bold">{formatCurrency(pay.amount)}</p>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" /> Completado</Badge>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Download className="w-4 h-4 mr-1" /> Recibo
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
