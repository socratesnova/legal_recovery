"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, Smartphone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("admin@legalrecovery.rd");
  const [password, setPassword] = useState("demo123");
  const [totp, setTotp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, totp: step === "mfa" ? totp : undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (step === "credentials" && data.error === "Credenciales inválidas") {
          setError("Credenciales inválidas");
          setLoading(false);
          return;
        }
        if (step === "mfa") {
          setError("Código MFA inválido. Use: 123456");
          setLoading(false);
          return;
        }
        setError(data.error || "Error de autenticación");
        setLoading(false);
        return;
      }

      if (step === "credentials") {
        setStep("mfa");
        setLoading(false);
        return;
      }

      localStorage.setItem("demo-token", data.token);
      localStorage.setItem("demo-user", JSON.stringify(data.user));
      router.push("/portal/admin/dashboard");
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Legal Recovery OS</h1>
          <p className="text-slate-400 mt-2">Plataforma de Gestión de Cobro Legal</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {step === "credentials" ? "Iniciar Sesión" : "Verificación MFA"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {step === "credentials"
                ? "Ingrese sus credenciales de acceso"
                : "Ingrese el código de su autenticador"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "credentials" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    placeholder="usuario@legalrecovery.rd"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totp" className="text-slate-300">Código de 6 dígitos</Label>
                  <Input
                    id="totp"
                    type="text"
                    maxLength={6}
                    value={totp}
                    onChange={(e) => setTotp(e.target.value.replace(/\D/g, ""))}
                    className="bg-slate-900/50 border-slate-600 text-white text-center text-2xl tracking-[0.5em] placeholder:text-slate-500"
                    placeholder="000000"
                  />
                  <p className="text-xs text-slate-500 text-center mt-1">
                    Demo: use el código <span className="text-emerald-400 font-mono">123456</span>
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              onClick={handleLogin}
              disabled={loading || (step === "mfa" && totp.length !== 6)}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : step === "credentials" ? (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Continuar
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Verificar y Entrar
                </span>
              )}
            </Button>

            {step === "mfa" && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-slate-400 hover:text-white"
                onClick={() => {
                  setStep("credentials");
                  setTotp("");
                  setError("");
                }}
              >
                Volver a credenciales
              </Button>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-xs mt-6">
          Ley 172-13 compliant · Data Passport activo · Legal Firewall habilitado
        </p>
      </div>
    </div>
  );
}