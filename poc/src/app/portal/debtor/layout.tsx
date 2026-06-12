"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  DollarSign,
  FileText,
  AlertCircle,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Building2,
  Smartphone,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const allNavItems = [
  { href: "/portal/debtor/dashboard", label: "Mis Deudas", icon: LayoutDashboard },
  { href: "/portal/debtor/institutions", label: "Entidades", icon: Building2 },
  { href: "/portal/debtor/agreements", label: "Acuerdos", icon: FileText },
  { href: "/portal/debtor/payments", label: "Pagos", icon: DollarSign },
  { href: "/portal/debtor/disputes", label: "Disputas", icon: AlertCircle },
  { href: "/portal/debtor/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/portal/debtor/profile", label: "Perfil", icon: User },
];

const bottomNavItems = [
  { href: "/portal/debtor/dashboard", label: "Deudas", icon: Home },
  { href: "/portal/debtor/agreements", label: "Acuerdos", icon: FileText },
  { href: "/portal/debtor/payments", label: "Pagos", icon: DollarSign },
  { href: "/portal/debtor/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/portal/debtor/profile", label: "Perfil", icon: User },
];

export default function DebtorLayout({ children }: { children: React.ReactNode }) {
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileScreen(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {isMobilePreview ? (
        <MobilePreviewContainer onExit={() => setIsMobilePreview(false)}>
          {children}
        </MobilePreviewContainer>
      ) : isMobileScreen ? (
        <MobileViewport>{children}</MobileViewport>
      ) : (
        <DesktopLayout onMobilePreview={() => setIsMobilePreview(true)}>
          {children}
        </DesktopLayout>
      )}
    </div>
  );
}

/* ──────────────────────── DESKTOP LAYOUT ──────────────────────── */

function DesktopLayout({ 
  children, 
  onMobilePreview 
}: { 
  children: React.ReactNode; 
  onMobilePreview: () => void;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <Link href="/portal/debtor/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Mi Deuda</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 mb-4">
            <p className="text-xs text-emerald-700 font-medium">Juan Pérez</p>
            <p className="text-xs text-emerald-600">001-1234567-8</p>
            <Badge className="mt-1 bg-emerald-100 text-emerald-800 text-[10px]">
              <Shield className="w-3 h-3 mr-1" />
              Identidad Verificada
            </Badge>
          </div>

          <nav className="space-y-1">
            {allNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <Button variant="ghost" className="w-full justify-start text-slate-500">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Portal del Deudor · Multi-Entidad</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={onMobilePreview}
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Vista Móvil
            </Button>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
              <Bell className="w-3 h-3 mr-1" />3
            </Badge>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">JP</div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
}

/* ──────────────────────── MOBILE PREVIEW CONTAINER ──────────────────────── */

function MobilePreviewContainer({ children, onExit }: { children: React.ReactNode; onExit: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Toolbar - HIGH CONTRAST */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-white">Vista Móvil</span>
          <span className="text-xs text-slate-400 hidden sm:inline">— iPhone 14 Pro Max (430×932)</span>
        </div>
        <Button
          size="sm"
          className="bg-white text-slate-900 hover:bg-slate-200 font-semibold shadow-lg border-0"
          onClick={onExit}
        >
          <Monitor className="w-4 h-4 mr-1.5" />
          Vista Desktop
        </Button>
      </div>

      {/* Phone frame area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto">
        <div 
          className="bg-slate-800 rounded-[40px] sm:rounded-[55px] p-2 sm:p-3 shadow-2xl border-4 border-slate-700 relative shrink-0"
          style={{ width: 430, height: 932 }}
        >
          <div className="w-full h-full bg-white rounded-[32px] sm:rounded-[45px] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-800 rounded-b-3xl z-[100]">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full">
                <div className="absolute top-1.5 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full">
                  <span className="sr-only">Cámara</span>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="h-14 bg-emerald-600 flex items-end justify-between px-7 pb-2 z-50 relative">
              <span className="text-xs font-semibold text-white">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73 1.6 0 3.15.25 4.6.72v3.1c0 .39.23.72.56.89.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z" />
                </svg>
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                </svg>
              </div>
            </div>

            {/* App Content */}
            <div className="absolute top-14 left-0 right-0 bottom-0 overflow-hidden">
              <MobileAppShell>{children}</MobileAppShell>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-slate-900 rounded-full z-[100]">
              <span className="sr-only">Indicador de inicio</span>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute -right-[7px] top-36 w-[7px] h-14 bg-slate-600 rounded-r-md">
            <span className="sr-only">Botón de encendido</span>
          </div>
          <div className="absolute -left-[7px] top-28 w-[7px] h-9 bg-slate-600 rounded-l-md">
            <span className="sr-only">Volumen +</span>
          </div>
          <div className="absolute -left-[7px] top-42 w-[7px] h-9 bg-slate-600 rounded-l-md">
            <span className="sr-only">Volumen -</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-900 text-center shrink-0">
        <p className="text-xs text-slate-400">
          Simulación iPhone 14 Pro Max. Menú y navegación inferior funcionan.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────── MOBILE VIEWPORT (real mobile) ──────────────────────── */

function MobileViewport({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen overflow-hidden">
      <MobileAppShell>{children}</MobileAppShell>
    </div>
  );
}

/* ──────────────────────── MOBILE APP SHELL ──────────────────────── */

function MobileAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentPageTitle = allNavItems.find(i => i.href === pathname)?.label || "Mi Deuda";

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Drawer overlay */}
      {drawerOpen && (
        <div 
          className="absolute inset-0 bg-black/40 z-[80]"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white z-[90] shadow-xl transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 bg-emerald-600 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">Mi Deuda</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-md hover:bg-white/10">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 mb-4">
            <p className="text-sm text-emerald-700 font-medium">Juan Pérez</p>
            <p className="text-xs text-emerald-600">001-1234567-8</p>
            <Badge className="mt-1 bg-emerald-100 text-emerald-800 text-[10px]">
              <Shield className="w-3 h-3 mr-1" />
              Identidad Verificada
            </Badge>
          </div>

          <nav className="space-y-1">
            {allNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <Button variant="ghost" className="w-full justify-start text-slate-500 text-sm">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="h-14 bg-emerald-600 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="text-white p-1 -ml-1 rounded-md hover:bg-white/10 active:bg-white/20 shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {pathname !== "/portal/debtor/dashboard" ? (
            <Link href="/portal/debtor/dashboard" className="flex items-center gap-1 text-white shrink-0">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm truncate">Atrás</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-bold text-white truncate">{currentPageTitle}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/portal/debtor/messages" className="relative">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-emerald-600">
              3
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="pb-20">
          {children}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="h-16 bg-white border-t border-slate-200 z-40 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-full px-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-lg transition-colors min-w-[56px] relative ${
                  isActive ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-8 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
