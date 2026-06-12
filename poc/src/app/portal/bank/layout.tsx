"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  CreditCard,
  ArrowLeftRight,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/portal/bank/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/bank/marketplace", label: "Marketplace", icon: Store },
  { href: "/portal/bank/portfolios", label: "Mis Carteras", icon: FolderOpen },
  { href: "/portal/bank/cases", label: "Expedientes", icon: CreditCard },
  { href: "/portal/bank/agreements", label: "Acuerdos", icon: FileText },
  { href: "/portal/bank/reports", label: "Reportes", icon: BarChart3 },
  { href: "/portal/bank/settings", label: "Configuración", icon: Settings },
];

export default function BankLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-950 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-800">
          <Link href="/portal/bank/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-sm block">Banco Popular</span>
              <span className="text-[10px] text-indigo-300">Portal Institucional</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-indigo-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-indigo-800">
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <Shield className="w-3 h-3" />
            <span>Multi-tenant · Solo lectura</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "text-indigo-200 hover:bg-indigo-900 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <Separator className="bg-indigo-800 mb-4" />
          <Link
            href="/portal/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-300 hover:bg-indigo-900 hover:text-white transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
            Cambiar a Admin
          </Link>
          <Link
            href="/portal/debtor/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-300 hover:bg-indigo-900 hover:text-white transition-colors"
          >
            <Shield className="w-5 h-5" />
            Portal Deudor
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">Banco Popular Dominicano</span>
            <span className="text-xs text-slate-400">· ID: inst-bpd-001</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Cartera Activa
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-slate-100 rounded-md px-2 py-1.5">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-indigo-600 text-white text-xs">BPD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900">Director de Riesgo</p>
                  <p className="text-xs text-slate-500">Banco Popular</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-slate-700 cursor-pointer">
                  <Link href="/portal/admin/dashboard" className="flex items-center gap-2 w-full">
                    <ArrowLeftRight className="w-4 h-4" />
                    Admin Legal Recovery
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
