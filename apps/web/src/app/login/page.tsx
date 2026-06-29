"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Shield, Lock, Building2 } from "lucide-react";
import { login } from "@/lib/api-client";

// Same default the middleware uses to validate the token. Stop-gap: once the
// backend sets an HttpOnly cookie on /auth/login, this helper disappears.
const AUTH_COOKIE = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8h, matching JWT exp

function setClientCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/portal/admin/dashboard";
  const reason = searchParams.get("reason");

  // Demo creds are pre-filled in development/demo builds only. The middleware
  // (apps/web/src/middleware.ts) enforces real auth at the edge regardless.
  const [email, setEmail] = useState("admin@legalrecovery.do");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(reason === "auth_unavailable" ? "Servicio de autenticación no disponible. Reintente." : "");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      // Mirror the JWT into a non-HttpOnly cookie so the Next.js middleware
      // (which runs server-side and cannot read localStorage) can see it.
      // Will be replaced by an HttpOnly Secure SameSite=Lax cookie set by the
      // backend on /auth/login (tracked in the security roadmap).
      setClientCookie(AUTH_COOKIE, data.access_token, COOKIE_MAX_AGE);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
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
            <CardTitle className="text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-slate-400">
              Ingrese sus credenciales de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  placeholder="usuario@legalrecovery.do"
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

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Entrar como Admin
                </span>
              )}
            </Button>

            <div className="mt-4 space-y-2">
              <p className="text-center text-xs text-slate-500">Acceso rápido demo:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                  onClick={() => router.push("/portal/bank/dashboard")}
                >
                  <Building2 className="w-4 h-4 mr-1.5" />
                  Portal Banco
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  onClick={() => router.push("/portal/debtor/dashboard")}
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  Portal Deudor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-xs mt-6">
          Ley 172-13 compliant · Data Passport activo · Legal Firewall habilitado
        </p>
      </div>
    </div>
  );
}