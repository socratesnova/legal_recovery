"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  FileText,
  Download,
  ArrowLeft,
  Scale,
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
import { Separator } from "@/components/ui/separator";
import { demoCases, formatCurrency } from "@/lib/seed-data";

const caseData = demoCases[0];

export default function DebtorAgreementPage() {
  const [accepted, setAccepted] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState(false);

  const originalBalance = caseData.balance;
  const discountPct = 20;
  const discountedBalance = Math.round(originalBalance * (1 - discountPct / 100));
  const installments = 3;
  const installmentAmount = Math.round(discountedBalance / installments);

  function handleAccept() {
    setAccepted(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/portal/debtor/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver
            </Button>
          </Link>
          <span className="font-semibold text-slate-900">
            Propuesta de Acuerdo
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4 pb-20">
        {accepted ? (
          /* Success State */
          <div className="space-y-4">
            <Card className="border-2 border-emerald-300 bg-emerald-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-emerald-700">
                  Acuerdo Aceptado
                </h2>
                <p className="text-sm text-emerald-600 mt-2">
                  Su acuerdo ha sido registrado exitosamente.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-white/80 text-xs font-mono text-slate-500">
                  Hash: 0x{Date.now().toString(16)}a4f8c...<br />
                  Timestamp: {new Date().toISOString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Paz y Salvo
                </CardTitle>
                <CardDescription>
                  Documento generado automáticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-center mb-2">
                    CERTIFICADO DE ACUERDO DE PAGO
                  </p>
                  <p>
                    Por medio del presente certificado, se hace constar que el
                    señor/a <strong>{caseData.debtor.name}</strong>, portador/a
                    de la cédula de identidad y electoral No.{" "}
                    <strong>{caseData.debtor.idNumber}</strong>, ha suscrito un
                    acuerdo de pago con <strong>Banco Popular Dominicano</strong>
                    , representado por Legal Recovery OS.
                  </p>
                  <Separator className="my-2" />
                  <p>
                    Monto original: <strong>{formatCurrency(originalBalance)}</strong>
                    <br />
                    Descuento aplicado: <strong>{discountPct}%</strong>
                    <br />
                    Nuevo saldo: <strong>{formatCurrency(discountedBalance)}</strong>
                    <br />
                    Cuotas: <strong>{installments}</strong> de{" "}
                    <strong>{formatCurrency(installmentAmount)}</strong>
                  </p>
                  <Separator className="my-2" />
                  <p className="text-[10px] text-slate-400">
                    Base legal: {caseData.dataPassport.legalBasis}
                    <br />
                    Firma digital verificada: ✓
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Agreement Proposal */
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Términos del Acuerdo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Saldo original</span>
                    <span className="text-sm line-through text-slate-400">
                      {formatCurrency(originalBalance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Descuento</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      -{discountPct}% (-{formatCurrency(originalBalance - discountedBalance)})
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      Nuevo saldo
                    </span>
                    <span className="text-xl font-bold text-emerald-700">
                      {formatCurrency(discountedBalance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Cuotas</span>
                    <span className="text-sm font-semibold">
                      {installments}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Monto por cuota
                    </span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(installmentAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation */}
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-emerald-700 mb-2">
                  ✓ Validaciones del banco
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Descuento 20% dentro de política (máx. 30%)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    3 cuotas dentro de rango (1-6)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Legal Firewall: sin restricciones
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Data Passport verificado
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accept */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedTerms}
                    onChange={(e) => setCheckedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Acepto los términos del acuerdo de pago y autorizo el
                    procesamiento de mis datos personales según la Ley 172-13 y
                    el Data Passport asociado a este caso. Entiendo que este
                    acuerdo es vinculante una vez aceptado.
                  </span>
                </label>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!checkedTerms}
                  onClick={handleAccept}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Aceptar Acuerdo
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}