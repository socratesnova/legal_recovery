"use client";

import Link from "next/link";
import {
  Shield,
  DollarSign,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Phone,
  ArrowRight,
  HelpCircle,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { demoCases, formatCurrency, formatDate } from "@/lib/seed-data";

const caseData = demoCases[0];

export default function DebtorDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Legal Recovery</span>
          </div>
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
            <Lock className="w-3 h-3 mr-1" />
            Portal Seguro
          </Badge>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4 pb-20">
        {/* Welcome */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-slate-900">
              Hola, {caseData.debtor.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Caso: {caseData.id} · {caseData.product}
            </p>
          </CardContent>
        </Card>

        {/* Balance */}
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Saldo Pendiente
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {formatCurrency(caseData.balance)}
            </p>
            <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200">
              Elegible para acuerdo
            </Badge>
          </CardContent>
        </Card>

        {/* Agreement Offer */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Propuesta de Acuerdo Disponible
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-800">Descuento</span>
                <span className="text-lg font-bold text-emerald-700">20%</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-800">Nuevo saldo</span>
                <span className="text-lg font-bold text-emerald-700">
                  {formatCurrency(caseData.balance * 0.8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-800">Cuotas</span>
                <span className="text-lg font-bold text-emerald-700">3</span>
              </div>
            </div>
            <Link href="/portal/debtor/agreement">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Ver propuesta completa
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {caseData.timeline.slice(-3).map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-900">{event.action}</p>
                    <p className="text-xs text-slate-400">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-slate-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Subir comprobante de pago
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-amber-700 border-amber-200"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Abrir disputa
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-slate-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contactar gestor
            </Button>
          </CardContent>
        </Card>

        {/* Legal notice */}
        <div className="p-3 rounded-lg bg-slate-100 text-center">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Sus datos personales están protegidos por la Ley 172-13. Data
            Passport activo. Solo se muestran datos autorizados para su caso.
          </p>
        </div>
      </main>
    </div>
  );
}