"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Smartphone,
  Copy,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Building2,
  PartyPopper,
  Clock,
  Calendar,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/seed-data";

type PaymentMethod =
  | "transferencia"
  | "tarjeta"
  | "efectivo"
  | "movil";

const paymentMethods: {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  recommended?: boolean;
}[] = [
  {
    id: "transferencia",
    label: "Transferencia bancaria",
    icon: <Building2 className="w-5 h-5" />,
    recommended: true,
  },
  {
    id: "tarjeta",
    label: "Tarjeta de crédito/débito",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "efectivo",
    label: "Pago en efectivo (sucursal BPD)",
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    id: "movil",
    label: "Pago móvil (app bancaria)",
    icon: <Smartphone className="w-5 h-5" />,
  },
];

const instructionsMap: Record<PaymentMethod, string[]> = {
  transferencia: [
    "Inicie sesión en su banca en línea o app bancaria.",
    "Seleccione 'Transferencias' → 'A terceros'.",
    "Ingrese la cuenta destino del Banco Popular Dominicano.",
    "Indique el monto exacto de la cuota.",
    "En el concepto/referencia use el número generado arriba.",
    "Guarde el comprobante y súbalo aquí.",
  ],
  tarjeta: [
    "Ingrese los datos de su tarjeta de crédito o débito.",
    "Verifique que el monto coincida con RD$33,333.",
    "Confirme la transacción con su banco emisor.",
    "Espere la confirmación en pantalla.",
    "Guarde el comprobante para sus registros.",
  ],
  efectivo: [
    "Acuda a cualquier sucursal del Banco Popular Dominicano.",
    "Solicite pago a cuenta de recuperación de cartera.",
    "Proporcione la referencia: PAG-AGR001-CUOTA01-20260610.",
    "Entregue el monto exacto en efectivo.",
    "Conserva el recibo firmado y súbalo aquí.",
  ],
  movil: [
    "Abra la app bancaria de BPD en su teléfono.",
    "Seleccione 'Pago Móvil' → 'A terceros'.",
    "Escanee o ingrese el número de destino.",
    "Indique el monto exacto de RD$33,333.",
    "Confirme con su PIN o biometría.",
    "Guarde la captura de pantalla y súbalo aquí.",
  ],
};

export default function DebtorPayPage() {
  const [method, setMethod] = useState<PaymentMethod>("transferencia");
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const reference = "PAG-AGR001-CUOTA01-20260610";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored for POC
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-3 sm:px-4">
        <Card className="w-full max-w-md border-emerald-200">
          <CardContent className="p-6 sm:p-8 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-emerald-700" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                ¡Pago registrado!
              </h2>
              <p className="text-sm text-slate-500">
                Su comprobante fue recibido correctamente.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Recibo</span>
                <span className="font-medium text-slate-900">REC-2026-001042</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Monto</span>
                <span className="font-medium text-slate-900">{formatCurrency(33333)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Método</span>
                <span className="font-medium text-slate-900">
                  {paymentMethods.find((m) => m.id === method)?.label}
                </span>
              </div>
              <Separator />
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <span>
                  Confirmación esperada en <strong>24–48 horas</strong> hábiles. Le
                  notificaremos por correo y portal.
                </span>
              </div>
            </div>
            <Link href="/portal/debtor/agreements" className="block">
              <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver a acuerdos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-3 sm:px-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/portal/debtor/agreements">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
          Realizar Pago
        </h1>
      </div>

      {/* Payment Summary Card */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 break-words">
                Banco Popular Dominicano
              </p>
              <p className="text-xs text-slate-500">Ref. agr-001</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-500">Cuota</p>
              <p className="text-sm font-bold text-slate-900">1/3</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <p className="text-xs text-emerald-600">A pagar</p>
              <p className="text-sm font-bold text-emerald-700">
                {formatCurrency(33333)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-500">Vencimiento</p>
              <div className="flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <p className="text-sm font-bold text-slate-900">15 jun 2026</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-xs text-blue-600">Descuento</p>
              <p className="text-sm font-bold text-blue-700">20%</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="text-slate-500">Saldo original</span>
            <span className="line-through text-slate-400">
              {formatCurrency(125000)}
            </span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-slate-500">Final</span>
            <span className="font-bold text-emerald-700">
              {formatCurrency(100000)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Método de pago
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {paymentMethods.map((m) => {
            const active = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={[
                  "flex items-center gap-3 w-full text-left p-3 rounded-lg border transition-all",
                  active
                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-300"
                    : "border-slate-200 bg-white hover:border-emerald-300",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    active
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-slate-300",
                  ].join(" ")}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                </div>
                <div
                  className={[
                    "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
                    active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <span className="break-words">{m.label}</span>
                    {m.recommended && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px] w-fit shrink-0">
                        Recomendado
                      </Badge>
                    )}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference Generator */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <p className="text-sm font-bold text-emerald-900">
              Referencia de pago
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 block p-2 bg-white rounded border border-emerald-200 text-xs sm:text-sm font-mono text-slate-800 break-all">
              {reference}
            </code>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 mr-1" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <p className="text-xs text-emerald-700">
            Utilice esta referencia exacta al realizar su pago para que podamos
            identificarlo correctamente.
          </p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Instrucciones
        </h2>
        <ol className="space-y-2">
          {instructionsMap[method].map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-700"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="break-words">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Upload Receipt */}
      <div className="space-y-2">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Comprobante de pago
        </h2>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 sm:p-8 text-center bg-slate-50 opacity-70">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500 mb-1">
            Subir comprobante de pago
          </p>
          <p className="text-xs text-slate-400">
            JPG, PNG o PDF hasta 5 MB
          </p>
          <input
            type="file"
            disabled
            className="hidden"
            aria-label="Subir comprobante"
          />
        </div>
      </div>

      {/* Legal Notice */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Al realizar este pago, acepto los términos del acuerdo y autorizo el
          procesamiento según <strong>Ley 172-13</strong> sobre protección de
          datos personales.
        </p>
      </div>

      {/* Confirm Payment Button */}
      <Button
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-base"
        onClick={() => setShowSuccess(true)}
      >
        <CheckCircle2 className="w-5 h-5 mr-2" />
        Confirmar Pago
      </Button>
    </div>
  );
}
