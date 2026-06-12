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
  Building2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  Scale,
  Clock,
  Calendar,
  Download,
  MessageSquare,
  Gavel,
  Ban,
  Fingerprint,
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
import { formatCurrency, formatDate } from "@/lib/seed-data";

const allDebts = [
  {
    id: "case-001",
    institution: "Banco Popular Dominicano",
    institutionLogo: "BPD",
    product: "Tarjeta de crédito castigada",
    originalAmount: 156000,
    currentAmount: 125000,
    paidAmount: 31000,
    status: "active",
    nextPaymentDate: "2026-06-15",
    nextPaymentAmount: 33333,
    agreement: {
      id: "agr-001",
      discount: 20,
      finalAmount: 100000,
      installments: 3,
      installmentAmount: 33333,
      paidInstallments: 0,
      totalInstallments: 3,
    },
    hasDispute: false,
    daysOverdue: 45,
    lastContact: "2026-06-09",
  },
  {
    id: "case-005",
    institution: "Banco BHD",
    institutionLogo: "BHD",
    product: "Préstamo vehículo",
    originalAmount: 78000,
    currentAmount: 65000,
    paidAmount: 13000,
    status: "active",
    nextPaymentDate: "2026-06-20",
    nextPaymentAmount: 45500,
    agreement: null,
    hasDispute: false,
    daysOverdue: 30,
    lastContact: "2026-06-08",
  },
  {
    id: "case-009",
    institution: "Banco BHD",
    institutionLogo: "BHD",
    product: "Préstamo personal",
    originalAmount: 45000,
    currentAmount: 42000,
    paidAmount: 3000,
    status: "active",
    nextPaymentDate: null,
    nextPaymentAmount: null,
    agreement: null,
    hasDispute: true,
    disputeReason: "Deuda ya saldada",
    daysOverdue: 60,
    lastContact: "2026-06-05",
  },
  {
    id: "case-011",
    institution: "Banco León",
    institutionLogo: "BL",
    product: "Hipoteca residencial",
    originalAmount: 3200000,
    currentAmount: 2800000,
    paidAmount: 400000,
    status: "active",
    nextPaymentDate: "2026-07-01",
    nextPaymentAmount: 25000,
    agreement: null,
    hasDispute: false,
    daysOverdue: 15,
    lastContact: "2026-06-07",
  },
];

const totalDebt = allDebts.reduce((a, d) => a + d.currentAmount, 0);
const totalPaid = allDebts.reduce((a, d) => a + d.paidAmount, 0);
const totalOriginal = allDebts.reduce((a, d) => a + d.originalAmount, 0);
const activeAgreements = allDebts.filter((d) => d.agreement).length;

export default function DebtorDashboardPage() {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Mis Deudas</h1>
          <p className="text-sm text-slate-500">Resumen de todas tus obligaciones por entidad</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <Fingerprint className="w-3 h-3 mr-1" />
          4 entidades
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
            <p className="text-xs text-slate-500 mt-2">{allDebts.length} obligaciones</p>
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
              <Progress value={(totalPaid / totalOriginal) * 100} className="h-1.5" />
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
            <p className="text-xs text-slate-500 mt-2">{allDebts.filter(d => !d.agreement).length} sin acuerdo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Disputas</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-700">{allDebts.filter(d => d.hasDispute).length}</p>
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

        {allDebts.map((debt) => (
          <Card key={debt.id} className={`overflow-hidden ${debt.hasDispute ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500"}`}>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {debt.institutionLogo}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-900">{debt.institution}</p>
                        {debt.hasDispute && (
                          <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            En disputa
                          </Badge>
                        )}
                        {debt.agreement && (
                          <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                            <FileText className="w-3 h-3 mr-1" />
                            Acuerdo activo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{debt.product} · {debt.id}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg sm:text-xl font-bold text-slate-900">{formatCurrency(debt.currentAmount)}</p>
                    <p className="text-xs text-slate-400">de {formatCurrency(debt.originalAmount)} original</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Progreso de pago</span>
                    <span className="font-medium">{Math.round((debt.paidAmount / debt.originalAmount) * 100)}% pagado</span>
                  </div>
                  <Progress value={(debt.paidAmount / debt.originalAmount) * 100} className="h-2" />
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">
                      {debt.daysOverdue} días vencido
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">
                      Último contacto: {formatDate(debt.lastContact)}
                    </span>
                  </div>
                </div>

                {debt.agreement && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">
                          Acuerdo: {debt.agreement.discount}% descuento · {debt.agreement.installments} cuotas
                        </span>
                      </div>
                      <span className="text-sm font-bold text-emerald-700">
                        {formatCurrency(debt.agreement.finalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-emerald-600">Próximo pago: {formatDate(debt.nextPaymentDate)} · {formatCurrency(debt.nextPaymentAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {!debt.agreement && !debt.hasDispute && (
                    <Link href="/portal/debtor/agreement">
                      <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                        <FileText className="w-4 h-4 mr-1" />
                        Solicitar Acuerdo
                      </Button>
                    </Link>
                  )}
                  {debt.agreement && (
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
        ))}
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
