"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, ShieldCheck, Clock, FileText, CheckCircle2, Gavel, Ban } from "lucide-react";
import { formatDate } from "@/lib/seed-data";

const disputes = [
  { id: "disp-001", institution: "Banco BHD", product: "Préstamo personal", reason: "Deuda ya saldada", status: "open", openedAt: "2026-06-05", evidence: "Comprobante de pago #4521", autoPaused: true },
];

export default function DebtorDisputesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Disputas</h1>
          <p className="text-sm text-slate-500">Reclamos y disputas activas</p>
        </div>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Nueva Disputa
        </Button>
      </div>

      {disputes.map((d) => (
        <Card key={d.id} className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Badge className="bg-amber-100 text-amber-800 w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Abierta</Badge>
                <span className="text-sm font-bold text-slate-900 break-words">{d.institution} · {d.product}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600"><strong>Motivo:</strong> {d.reason}</p>
                <p className="text-sm text-slate-600 break-words"><strong>Evidencia:</strong> {d.evidence}</p>
                <p className="text-xs text-slate-400 mt-1"><Clock className="w-3 h-3 inline mr-1" /> Abierta: {formatDate(d.openedAt)}</p>
              </div>
            </div>
            {d.autoPaused && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-700">
                <ShieldCheck className="w-3 h-3 inline mr-1" /> Legal Firewall: toda gestión de cobro pausada automáticamente hasta resolución.
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
