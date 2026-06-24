"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Scale,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ShieldCheck,
  CalendarDays,
  Banknote,
  Landmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DebtorTermsPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-slate-600 hover:text-emerald-700"
              onClick={() => router.back()}
              aria-label="Volver"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Términos del Acuerdo
              </h1>
              <p className="text-xs text-slate-500">Revisa y acepta las condiciones</p>
            </div>
          </div>
          <Scale className="h-5 w-5 text-emerald-700" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {/* Agreement reference card */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Acuerdo</p>
                  <p className="text-xs text-slate-500">agr-001</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">Banco Popular</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  20% descuento
                </Badge>
                <Badge variant="outline" className="border-slate-300 text-slate-700">
                  3 cuotas
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms sections */}
        <div className="space-y-4">
          {/* 1. Objeto */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  1
                </span>
                Objeto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-slate-700">
              El deudor se obliga a pagar el saldo adeudado conforme a las condiciones establecidas en el presente acuerdo, y el acreedor se compromete a aplicar el descuento convenido y a no iniciar ni continuar acciones de cobro judicial mientras se cumplan las obligaciones aquí pactadas.
            </CardContent>
          </Card>

          {/* 2. Monto y descuento */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  2
                </span>
                Monto y descuento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-slate-700">
              <div className="flex items-center gap-2 text-slate-900">
                <Banknote className="h-4 w-4 text-emerald-700" />
                <span className="font-medium">Original:</span>
                <span className="text-slate-500 line-through">RD$125,000</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-slate-900">
                <Banknote className="h-4 w-4 text-emerald-700" />
                <span className="font-medium">Final con descuento:</span>
                <span className="font-semibold text-emerald-700">RD$100,000</span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Calendario de pagos */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  3
                </span>
                Calendario de pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-slate-700">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-emerald-700" />
                <span>3 cuotas de</span>
                <span className="font-semibold text-emerald-700">RD$33,333</span>
                <span>aproximadamente, vencimiento el día 15 de cada mes.</span>
              </div>
            </CardContent>
          </Card>

          {/* 4. Incumplimiento */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  4
                </span>
                Incumplimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-slate-700">
              <div className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p>
                  En caso de falta de pago de cualquier cuota en la fecha acordada, el descuento quedará revocado y el saldo original (RD$125,000) será exigible de inmediato, sin perjuicio de las acciones legales que correspondan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5. Confidencialidad */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  5
                </span>
                Confidencialidad
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-slate-700">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <p>
                  Las partes se obligan a mantener la confidencialidad de la información intercambiada en el marco de este acuerdo, en cumplimiento de las normas de protección de datos personales aplicables.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Ley aplicable */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  6
                </span>
                Ley aplicable
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-slate-700">
              Este acuerdo se regirá por las disposiciones de la{" "}
              <span className="font-medium text-slate-900">Ley 172-13</span> y demás
              normas complementarias sobre protección de datos y prácticas de cobro
              de deudas en la República Dominicana.
            </CardContent>
          </Card>
        </div>

        {/* Acceptance checkbox */}
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-emerald-600 text-emerald-700 focus:ring-emerald-600"
            />
            <label
              htmlFor="accept"
              className="cursor-pointer text-sm leading-relaxed text-slate-800"
            >
              He leído y acepto los términos y condiciones de este acuerdo.
            </label>
          </CardContent>
        </Card>

        {/* Digital signature area (visual) */}
        <Card className="border-dashed border-slate-300 bg-slate-50 shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500">
              <PenTool className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Firma digital pendiente</p>
            <p className="text-xs text-slate-500">
              Una vez aceptes los términos, podrás firmar digitalmente para formalizar el acuerdo.
            </p>
          </CardContent>
        </Card>

        {/* Legal notice */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">Aviso legal:</span>{" "}
              Este acuerdo tiene fuerza ejecutiva una vez firmado digitalmente por ambas partes.
              Conserve una copia para sus registros. Si tiene dudas, consulte a un abogado antes
              de aceptar.
            </p>
          </div>
        </div>

        {/* Primary action */}
        <div className="pb-6">
          <Button
            className="w-full bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
            disabled={!accepted}
            onClick={() => {
              // Placeholder for future signature flow
            }}
          >
            Continuar a firma digital
          </Button>
          {!accepted && (
            <p className="mt-2 text-center text-xs text-slate-500">
              Debes aceptar los términos para continuar.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
