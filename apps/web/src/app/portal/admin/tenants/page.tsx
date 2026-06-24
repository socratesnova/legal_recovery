"use client";

import {
  Building2,
  Users,
  DollarSign,
  Settings,
  Plus,
  TrendingUp,
  TrendingDown,
  User,
  Mail,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/seed-data";

const institutions = [
  {
    id: "inst-001",
    name: "Banco Popular Dominicano",
    initials: "BPD",
    status: "active",
    cases: 1200,
    amount: 50000000,
    quality: 87,
    contact: "Lic. Ana Martínez",
    email: "ana.martinez@bpd.com.do",
  },
  {
    id: "inst-002",
    name: "Banco BHD",
    initials: "BHD",
    status: "active",
    cases: 890,
    amount: 32000000,
    quality: 79,
    contact: "Ing. Luis Fernández",
    email: "l.fernandez@bhd.com.do",
  },
  {
    id: "inst-003",
    name: "Banco León",
    initials: "BL",
    status: "active",
    cases: 450,
    amount: 28000000,
    quality: 92,
    contact: "Sra. Carmen Duarte",
    email: "c.duarte@bancoleon.com.do",
  },
  {
    id: "inst-004",
    name: "Banco Santa Cruz",
    initials: "BSC",
    status: "trial",
    cases: 120,
    amount: 5000000,
    quality: 70,
    contact: "Dr. Pedro Santos",
    email: "p.santos@bsc.com.do",
  },
  {
    id: "inst-005",
    name: "Cooperativa La Altagracia",
    initials: "CLA",
    status: "active",
    cases: 340,
    amount: 8000000,
    quality: 75,
    contact: "Lic. Rosa Peña",
    email: "r.pena@coopaltagracia.com.do",
  },
  {
    id: "inst-006",
    name: "Fondo Inversión Recovery Plus",
    initials: "FIR",
    status: "paused",
    cases: 0,
    amount: 0,
    quality: null,
    contact: "Sr. Miguel Vargas",
    email: "m.vargas@recoveryplus.com.do",
  },
];

const stats = [
  {
    label: "Instituciones activas",
    value: "5",
    icon: Building2,
    accent: "emerald" as const,
  },
  {
    label: "Casos totales",
    value: "3,000",
    icon: Users,
    accent: "blue" as const,
  },
  {
    label: "Monto asignado",
    value: formatCurrency(123000000),
    icon: DollarSign,
    accent: "amber" as const,
  },
  {
    label: "En trial/pausa",
    value: "2",
    icon: Clock,
    accent: "slate" as const,
  },
];

const activities = [
  { institution: "BPD", event: "Cartera cargada", date: "1 Jun 2026", icon: TrendingUp },
  { institution: "BHD", event: "Nuevo acuerdo aprobado", date: "5 Jun 2026", icon: TrendingUp },
  { institution: "BL", event: "Disputa resuelta", date: "8 Jun 2026", icon: TrendingUp },
  { institution: "Santa Cruz", event: "Trial iniciado", date: "1 Jun 2026", icon: TrendingDown },
];

function statusBadgeClasses(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "trial":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "paused":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "Activo";
    case "trial":
      return "Trial";
    case "paused":
      return "Pausado";
    default:
      return status;
  }
}

function qualityTextColor(quality: number | null) {
  if (quality === null) return "text-slate-400";
  if (quality >= 85) return "text-emerald-600";
  if (quality >= 75) return "text-blue-600";
  if (quality >= 70) return "text-amber-600";
  return "text-red-600";
}

function qualityProgressClass(quality: number | null) {
  if (quality === null) return "[&_[data-slot=progress-indicator]]:bg-slate-300 [&_[data-slot=progress-track]]:bg-slate-100";
  if (quality >= 85) return "[&_[data-slot=progress-indicator]]:bg-emerald-500 [&_[data-slot=progress-track]]:bg-emerald-100";
  if (quality >= 75) return "[&_[data-slot=progress-indicator]]:bg-blue-500 [&_[data-slot=progress-track]]:bg-blue-100";
  if (quality >= 70) return "[&_[data-slot=progress-indicator]]:bg-amber-500 [&_[data-slot=progress-track]]:bg-amber-100";
  return "[&_[data-slot=progress-indicator]]:bg-red-500 [&_[data-slot=progress-track]]:bg-red-100";
}

export default function TenantsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Instituciones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administración multi-tenant de entidades financieras
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 w-fit"
        >
          <Building2 className="w-3 h-3 mr-1" />
          6 instituciones
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const accentBg =
            stat.accent === "emerald"
              ? "bg-emerald-100"
              : stat.accent === "blue"
                ? "bg-blue-100"
                : stat.accent === "amber"
                  ? "bg-amber-100"
                  : "bg-slate-100";
          const accentText =
            stat.accent === "emerald"
              ? "text-emerald-600"
              : stat.accent === "blue"
                ? "text-blue-600"
                : stat.accent === "amber"
                  ? "text-amber-600"
                  : "text-slate-600";
          const borderLeft =
            stat.accent === "emerald"
              ? "border-l-emerald-500"
              : stat.accent === "blue"
                ? "border-l-blue-500"
                : stat.accent === "amber"
                  ? "border-l-amber-500"
                  : "border-l-slate-500";
          const gradientFrom =
            stat.accent === "emerald"
              ? "from-emerald-50/50"
              : stat.accent === "blue"
                ? "from-blue-50/50"
                : stat.accent === "amber"
                  ? "from-amber-50/50"
                  : "from-slate-50/50";

          return (
            <Card
              key={stat.label}
              className={`border-l-4 ${borderLeft} bg-gradient-to-br ${gradientFrom} to-white`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${accentBg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${accentText}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Institution Cards + Add Institution */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {institutions.map((inst) => (
          <Card key={inst.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-slate-700">
                    {inst.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {inst.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`shrink-0 ${statusBadgeClasses(inst.status)}`}
                    >
                      {statusLabel(inst.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500">Casos</p>
                      <p className="text-lg font-bold text-slate-900">
                        {inst.cases.toLocaleString("es-DO")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Monto asignado</p>
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(inst.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">
                        Calidad de cartera
                      </span>
                      <span
                        className={`text-xs font-bold ${qualityTextColor(inst.quality)}`}
                      >
                        {inst.quality !== null ? `${inst.quality}%` : "N/A"}
                      </span>
                    </div>
                    <div className={qualityProgressClass(inst.quality)}>
                      <Progress
                        value={inst.quality ?? 0}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1 min-w-0">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{inst.contact}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{inst.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-emerald-700 text-white hover:bg-emerald-800"
                    >
                      Ver Detalle
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3.5 h-3.5 mr-1" />
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Institution CTA */}
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <Plus className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-slate-900">
            Agregar Institución
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Configurar nueva entidad financiera
          </p>
          <Button
            disabled
            className="mt-4 bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva Institución
          </Button>
        </Card>
      </div>

      {/* Tenant Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            Actividad Reciente de Tenants
          </CardTitle>
          <CardDescription>
            Eventos recientes por institución
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">
                      {activity.institution}
                    </span>
                    : {activity.event}
                  </p>
                  <p className="text-xs text-slate-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
