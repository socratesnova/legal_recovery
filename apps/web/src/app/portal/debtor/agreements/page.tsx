"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  AlertTriangle,
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
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

interface Agreement {
  id: string;
  caseId: string;
  type: string;
  amount: number;
  discountPercentage: number | null;
  installments: number | null;
  status: string;
  createdAt: string;
  case?: {
    caseNumber: string;
    debtor?: {
      firstName: string;
      lastName: string;
    };
    products?: { productType: string }[];
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

export default function DebtorAgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [checkedTerms, setCheckedTerms] = useState(false);

  useEffect(() => {
    apiClient
      .get<Agreement[]>("/agreements")
      .then((data) => {
        setAgreements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error cargando acuerdos");
        setLoading(false);
      });
  }, []);

  const myAgreements = agreements.filter(
    (a) => a.status === "ACTIVE" || a.status === "APPROVED" || a.status === "COMPLETED"
  );
  const pendingAgreements = agreements.filter(
    (a) => a.status === "DRAFT" || a.status === "PENDING_APPROVAL"
  );

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
          {myAgreements.map((agr) => {
            const institutionName = agr.case?.institution?.name || "Banco";
            const productType = agr.case?.products?.[0]?.productType || "N/A";
            const installmentAmount =
              agr.installments && agr.installments > 0
                ? Number(agr.amount) / agr.installments
                : Number(agr.amount);
            return (
              <Card key={agr.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-3 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 break-words">{institutionName}</p>
                      <p className="text-sm text-slate-500 break-words">{productType} · {agr.case?.caseNumber || agr.caseId}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 w-fit">
                      <Zap className="w-3 h-3 mr-1" /> Activo
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Monto</p>
                      <p className="text-sm font-bold text-slate-900 break-words">{formatCurrency(Number(agr.amount))}</p>
                    </div>
                    <div className="text-center p-2 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-emerald-600">Descuento</p>
                      <p className="text-sm font-bold text-emerald-700">{agr.discountPercentage ?? 0}%</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">Cuotas</p>
                      <p className="text-sm font-bold text-blue-700">{agr.installments ?? 1}x {formatCurrency(installmentAmount)}</p>
                    </div>
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
            );
          })}
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

        {pendingAgreements.length === 0 && myAgreements.length === 0 && (
          <div className="text-center py-8 text-slate-500">No hay acuerdos ni propuestas disponibles.</div>
        )}

        {pendingAgreements.map((agr) => {
          const institutionName = agr.case?.institution?.name || "Banco";
          const productType = agr.case?.products?.[0]?.productType || "N/A";
          const installmentAmount =
            agr.installments && agr.installments > 0
              ? Number(agr.amount) / agr.installments
              : Number(agr.amount);
          return (
            <Card key={agr.id} className="border-l-4 border-l-emerald-400 hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 break-words">{institutionName}</p>
                    <p className="text-sm text-slate-500 break-words">{productType}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] w-fit">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Generado
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Monto acordado</p>
                    <p className="font-bold text-slate-900 break-words">{formatCurrency(Number(agr.amount))}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <p className="text-xs text-emerald-600">Descuento</p>
                    <p className="font-bold text-emerald-700">{agr.discountPercentage ?? 0}%</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-center">
                    <p className="text-xs text-blue-600">Final</p>
                    <p className="font-bold text-blue-700 break-words">{formatCurrency(Number(agr.amount))}</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-center">
                    <p className="text-xs text-amber-600">Cuotas</p>
                    <p className="font-bold text-amber-700">{agr.installments ?? 1}x {formatCurrency(installmentAmount)}</p>
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
                    Creado: {formatDate(agr.createdAt)}
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white w-full sm:w-auto"
                    onClick={() => { setSelectedAgreement(agr); setShowAcceptModal(true); }}
                  >
                    Ver y Aceptar
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showAcceptModal} onOpenChange={() => { setShowAcceptModal(false); setCheckedTerms(false); }}>
        <DialogContent className="max-w-lg p-4 sm:p-6">
          {selectedAgreement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Aceptar Acuerdo
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  {selectedAgreement.case?.institution?.name || "Banco"} · {selectedAgreement.case?.products?.[0]?.productType || "Producto"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Monto acordado</span><span className="text-sm font-bold text-slate-900 break-words">{formatCurrency(Number(selectedAgreement.amount))}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Descuento</span><span className="text-sm font-bold text-emerald-600 break-words">-{selectedAgreement.discountPercentage ?? 0}%</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-sm font-bold text-slate-900">Nuevo saldo</span><span className="text-lg font-bold text-emerald-700 break-words">{formatCurrency(Number(selectedAgreement.amount))}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Cuotas</span><span className="text-sm font-bold break-words">{selectedAgreement.installments ?? 1}x {formatCurrency(selectedAgreement.installments && selectedAgreement.installments > 0 ? Number(selectedAgreement.amount) / selectedAgreement.installments : Number(selectedAgreement.amount))}</span></div>
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
