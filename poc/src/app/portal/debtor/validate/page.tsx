"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  CreditCard,
  Phone,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Step = "cedula" | "security" | "otp" | "success";

export default function DebtorValidatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("cedula");
  const [cedula, setCedula] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [otp, setOtp] = useState("");
  const [progress, setProgress] = useState(33);

  function handleNext() {
    if (step === "cedula") {
      setCedula("001-1234567-8");
      setStep("security");
      setProgress(66);
    } else if (step === "security") {
      setStep("otp");
      setProgress(100);
    } else if (step === "otp") {
      setStep("success");
      setTimeout(() => {
        router.push("/portal/debtor/dashboard");
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 mb-4">
            <Shield className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Verificación de Identidad
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Para proteger sus datos, necesitamos verificar su identidad
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Cédula</span>
            <span>Pregunta de seguridad</span>
            <span>Código OTP</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-6">
            {step === "cedula" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    Ingrese su número de cédula para comenzar la verificación
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cedula">Número de Cédula</Label>
                  <Input
                    id="cedula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="000-0000000-0"
                    className="text-center font-mono text-lg tracking-wider"
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Demo: ingrese cualquier número o presione Continuar
                </p>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleNext}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {step === "security" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-700">
                    Cédula verificada. Responda la pregunta de seguridad.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Pregunta de Seguridad</Label>
                  <p className="text-sm font-medium text-slate-700 p-3 bg-slate-50 rounded-lg">
                    ¿Cuál es el nombre de su banco?
                  </p>
                  <Input
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Respuesta"
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Demo: cualquier respuesta es válida
                </p>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleNext}
                >
                  Verificar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-700">
                    Se envió un código a su teléfono registrado.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Código de verificación</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(6))
                    }
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={6}
                    placeholder="000000"
                  />
                  <p className="text-xs text-slate-400 text-center">
                    Demo: ingrese <span className="font-mono text-emerald-600">123456</span>
                  </p>
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleNext}
                  disabled={otp.length !== 6}
                >
                  Verificar Identidad
                  <Shield className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">
                  ¡Identidad verificada!
                </h3>
                <p className="text-sm text-slate-500">
                  Redirigiendo a su portal...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="w-3 h-3" />
            <span>Protegido por Ley 172-13 · Data Passport Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
}