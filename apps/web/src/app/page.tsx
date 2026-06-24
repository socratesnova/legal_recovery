"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Gavel,
  Building2,
  Users,
  Database,
  Brain,
  MessageSquare,
  FileText,
  CheckCircle,
  Upload,
  Cpu,
  Handshake,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <Shield className="h-7 w-7 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Legal Recovery <span className="text-emerald-400">OS</span>
              </span>
            </div>

            {/* Tagline */}
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Recuperación Inteligente de{" "}
              <span className="text-emerald-400">Cartera Castigada</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Plataforma legal multi-tenant para oficinas de cobro, bancos y deudores.
              Con IA, gobierno de datos y cumplimiento Ley 172-13.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/portal/admin">
                <Button
                  size="lg"
                  className="h-11 gap-2 bg-emerald-600 px-6 text-white hover:bg-emerald-700"
                >
                  Demo Admin
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portal/bank">
                <Button
                  size="lg"
                  className="h-11 gap-2 bg-indigo-600 px-6 text-white hover:bg-indigo-700"
                >
                  Demo Banco
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portal/debtor">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 gap-2 border-slate-500 px-6 text-slate-200 hover:border-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Demo Deudor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-6 border-t border-slate-800 pt-10 sm:grid-cols-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">3,000+</div>
                <div className="mt-1 text-sm text-slate-400">Casos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">RD$123M+</div>
                <div className="mt-1 text-sm text-slate-400">Recuperados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">6</div>
                <div className="mt-1 text-sm text-slate-400">Instituciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 sm:text-3xl">98.5%</div>
                <div className="mt-1 text-sm text-slate-400">Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PORTALES */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tres Portales, una Plataforma
            </h2>
            <p className="mt-4 text-slate-400">
              Experiencia adaptada a cada actor del ecosistema de recuperación legal.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Admin Legal */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition-colors hover:border-emerald-500/40 hover:bg-slate-900 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <Gavel className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Admin Legal</h3>
              <p className="mt-2 text-sm text-slate-400">Oficinas legales</p>
              <p className="mt-4 text-slate-300">
                Gestiona carteras, expedientes y comunicaciones con apoyo de IA. Control
                total del ciclo de recuperación judicial y extrajudicial.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Carteras y expedientes digitales
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  AI Copilot para estrategia legal
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Comunicaciones omnicanal reguladas
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/portal/admin">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-200 hover:border-emerald-500/40 hover:bg-slate-800 hover:text-white"
                  >
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portal Banco */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition-colors hover:border-indigo-500/40 hover:bg-slate-900 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                <Building2 className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Portal Banco</h3>
              <p className="mt-2 text-sm text-slate-400">Instituciones financieras</p>
              <p className="mt-4 text-slate-300">
                Visibilidad ejecutiva sobre el desempeño de carteras castigadas. Reportes en
                tiempo real, control de comisiones y trazabilidad completa.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  Dashboard ejecutivo
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  Reportes de recuperación y comisiones
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  Control por cartera y oficina legal
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/portal/bank">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-200 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white"
                  >
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Portal Deudor */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition-colors hover:border-sky-500/40 hover:bg-slate-900 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                <Users className="h-6 w-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Portal Deudor</h3>
              <p className="mt-2 text-sm text-slate-400">Deudores</p>
              <p className="mt-4 text-slate-300">
                Auto-servicio transparente: valida tu deuda, negocia acuerdos, realiza pagos
                y levanta disputas de forma segura y rastreable.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                  Validación de deuda con Data Passport
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                  Acuerdos y planillas de pago
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                  Disputas y trazabilidad legal
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/portal/debtor">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-200 hover:border-sky-500/40 hover:bg-slate-800 hover:text-white"
                  >
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Funcionalidades Clave
            </h2>
            <p className="mt-4 text-slate-400">
              Diseñado para recuperar más, cumpliendo siempre.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Legal Firewall */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Legal Firewall</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Bloquea automáticamente contactos no autorizados, datos sin fuente legal y
                canales restringidos antes de que ocurra una violación.
              </p>
            </div>

            {/* Data Passport */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <Database className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Data Passport</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Cada campo de datos lleva su pasaporte: fuente, base legal, usos permitidos,
                restricciones y fecha de expiración.
              </p>
            </div>

            {/* AI Scoring */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Scoring</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Score inteligente por caso que prioriza acciones, presupuesta esfuerzo y
                recomienda la siguiente mejor acción legal.
              </p>
            </div>

            {/* Omnicanal Comms */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <MessageSquare className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Omnicanal Comms</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Portal, correo, carta QR, voicebot, SMS y WhatsApp regulado. Prioridad por
                costo, riesgo y canal preferido del deudor.
              </p>
            </div>

            {/* Document Management */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <FileText className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Document Management</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Gestión documental con OCR, plantillas legales, firma digital y trazabilidad
                de cada versión desde la carga hasta el archivo.
              </p>
            </div>

            {/* Audit & Compliance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Audit & Compliance</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Logs inmutables de cada acción. Reportes regulatorios listos para JD, SIB y
                protección de datos. Siempre auditable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-slate-400">
              De la carga a la recuperación en cuatro pasos claros.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <Upload className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-400">
                Paso 1
              </div>
              <h3 className="text-lg font-semibold text-white">Carga cartera</h3>
              <p className="mt-2 text-sm text-slate-400">
                Sube carteras castigadas con validación automática de campos, duplicados y
                formato exigido.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <Cpu className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-400">
                Paso 2
              </div>
              <h3 className="text-lg font-semibold text-white">IA analiza</h3>
              <p className="mt-2 text-sm text-slate-400">
                El motor de IA califica cada caso, asigna presupuesto y recomienda la
                estrategia óptima de recuperación.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <Handshake className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-400">
                Paso 3
              </div>
              <h3 className="text-lg font-semibold text-white">Negocia</h3>
              <p className="mt-2 text-sm text-slate-400">
                Contacto regulado, acuerdos de pago, gestión de disputas y comunicación
                transparente con el deudor.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <TrendingUp className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-400">
                Paso 4
              </div>
              <h3 className="text-lg font-semibold text-white">Recupera</h3>
              <p className="mt-2 text-sm text-slate-400">
                Pagos conciliados, cartera recuperada, reportes ejecutivos y auditoría
                inmutable de todo el proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center justify-center gap-2 text-white">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold">Legal Recovery OS</span>
          </div>
          <p className="text-sm text-slate-400">
            Ley 172-13 compliant · Data Passport · Legal Firewall
          </p>
          <p className="mt-2 text-sm text-slate-500">
            legalrecovery.rd · República Dominicana
          </p>
          <p className="mt-6 text-xs text-slate-600">
            © 2026 Legal Recovery OS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
