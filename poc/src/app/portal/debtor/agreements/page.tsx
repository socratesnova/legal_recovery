"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  Zap,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/seed-data";
import Link from "next/link";

const agreementProposals = [
  {
    id: "prop-001",
    caseId: "case-001",
    institution: "Banco Popular Dominicano",
    product: "Tarjeta de crédito castigada",
    originalAmount: 125000,
    discount: 20,
    finalAmount: 100000,
    installments: 3,
    installmentAmount: 33333,
    generatedBy: "AI Copilot",
    expiresAt: "2026-06-20",
    status: "available",
    compliance: {
      withinDiscount: true,
      withinInstallments: true,
      noDispute: true,
    },
  },
  {
    id: "prop-002",
    caseId: "case-005",
    institution: "Banco BHD",
    product: "Préstamo vehículo",
    originalAmount: 65000,
    discount: 15,
    finalAmount: 55250,
    installments: 4,
    installmentAmount: 13813,
    generatedBy: "AI Copilot",
    expiresAt: "2026-06-25",
    status: "available",
    compliance: {
      withinDiscount: true,
      withinInstallments: true,
      noDispute: true,
    },
  },
  {
    id: "prop-003",
    caseId: "case-011",
    institution: "Banco León",
    product: "Hipoteca residencial",
    originalAmount: 2800000,
    discount: 10,
    finalAmount: 2520000,
    installments: 12,
    installmentAmount: 210000,
    generatedBy: "AI Copilot",
    expiresAt: "2026-06-30",
    status: "available",
    compliance: {
      withinDiscount: true,
      withinInstallments: true,
      noDispute: true,
    },
  },
];

const myAgreements = [
  {
    id: "agr-001",
    caseId: "case-001",
    institution: "Banco Popular Dominicano",
    product: "Tarjeta de crédito castigada",
    originalAmount: 125000,
    discount: 20,
    finalAmount: 100000,
    installments: 3,
    installmentAmount: 33333,
    status: "active",
    createdAt: "2026-06-09",
    payments: [
      { date: "2026-06-15", amount: 33333, status: "pending" },
      { date: "2026-07-15", amount: 33333, status: "pending" },
      { date: "2026-08-15", amount: 33334, status: "pending" },
    ],
  },
];

export default function DebtorAgreementsPage() {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<typeof agreementProposals[0] | null>(null);
  const [checkedTerms, setCheckedTerms] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-3 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/portal/debtor/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">Acuerdos de Pago</h1>
      </div>

      {myAgreements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Mis Acuerdos Activos
          </h2>
          {myAgreements.map((agr) => (
            <Card key={agr.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-3 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 break-words">{agr.institution}</p>
                    <p className="text-sm text-slate-500 break-words">{agr.product} · {agr.id}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 w-fit">
                    <Zap className="w-3 h-3 mr-1" /> Activo
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Original</p>
                    <p className="text-sm font-bold text-slate-900 line-through break-words">{formatCurrency(agr.originalAmount)}</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <p className="text-xs text-emerald-600">Descuento</p>
                    <p className="text-sm font-bold text-emerald-700">{agr.discount}%</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Final</p>
                    <p className="text-sm font-bold text-blue-700 break-words">{formatCurrency(agr.finalAmount)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Calendario de pagos:</p>
                  {agr.payments.map((p, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-2 rounded bg-slate-50">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Cuota {i + 1}/{agr.installments}</span>
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-sm text-slate-600">{formatDate(p.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm break-words">{formatCurrency(p.amount)}</span>
                        <Badge className={p.status === "paid" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                          {p.status === "paid" ? "Pagado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                    <DollarSign className="w-4 h-4 mr-1" /> Pagar Cuota
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" /> Ver contrato
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-600" />
          Propuestas Disponibles
        </h2>
        <p className="text-sm text-slate-500">
          Propuestas generadas por IA basadas en tu perfil y historial de pagos
        </p>

        {agreementProposals.map((prop) => (
          <Card key={prop.id} className="border-l-4 border-l-emerald-400 hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 break-words">{prop.institution}</p>
                  <p className="text-sm text-slate-500 break-words">{prop.product}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px] w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Generado
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Original</p>
                  <p className="font-bold text-slate-900 line-through break-words">{formatCurrency(prop.originalAmount)}</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg text-center">
                  <p className="text-xs text-emerald-600">Descuento</p>
                  <p className="font-bold text-emerald-700">{prop.discount}%</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-center">
                  <p className="text-xs text-blue-600">Final</p>
                  <p className="font-bold text-blue-700 break-words">{formatCurrency(prop.finalAmount)}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg text-center">
                  <p className="text-xs text-amber-600">Cuotas</p>
                  <p className="font-bold text-amber-700">{prop.installments}x</p>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-200 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-800">Validado por Legal Firewall</span>
                </div>
                <div className="space-y-1 text-xs text-emerald-700">
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Descuento dentro de política</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Cuotas dentro de rango</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sin disputas activas</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="text-xs text-slate-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Vence: {formatDate(prop.expiresAt)}
                </div>
                <Button
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white w-full sm:w-auto"
                  onClick={() => { setSelectedProposal(prop); setShowAcceptModal(true); }}
                >
                  Ver y Aceptar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAcceptModal} onOpenChange={() => { setShowAcceptModal(false); setCheckedTerms(false); }}>
        <DialogContent className="max-w-lg p-4 sm:p-6">
          {selectedProposal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Aceptar Acuerdo
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  {selectedProposal.institution} · {selectedProposal.product}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Saldo original</span><span className="text-sm line-through text-slate-400 break-words">{formatCurrency(selectedProposal.originalAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Descuento</span><span className="text-sm font-bold text-emerald-600 break-words">-{selectedProposal.discount}% ({formatCurrency(selectedProposal.originalAmount - selectedProposal.finalAmount)})</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-sm font-bold text-slate-900">Nuevo saldo</span><span className="text-lg font-bold text-emerald-700 break-words">{formatCurrency(selectedProposal.finalAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Cuotas</span><span className="text-sm font-bold break-words">{selectedProposal.installments}x {formatCurrency(selectedProposal.installmentAmount)}</span></div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={checkedTerms} onChange={(e) => setCheckedTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600" />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Acepto los términos del acuerdo de pago y autorizo el procesamiento de mis datos según la Ley 172-13 y el Data Passport.
                  </span>
                </label>

                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white" disabled={!checkedTerms}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Aceptar Acuerdo
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
