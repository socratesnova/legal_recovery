import Link from "next/link"
import { ArrowLeft, Home, LogIn, Shield, X } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Shield className="h-10 w-10 text-emerald-400" />
            <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 ring-1 ring-red-500/30">
              <X className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>

        <h1 className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Página no encontrada
        </h2>

        <p className="mt-2 max-w-md text-slate-400">
          La página que buscas no existe o ha sido movida.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver atrás
          </Link>

          <Link
            href="/portal/admin/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Ir al Dashboard
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-slate-100"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Ir al Login
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-slate-500">
        Legal Recovery OS · Todos los derechos reservados
      </footer>
    </div>
  )
}
