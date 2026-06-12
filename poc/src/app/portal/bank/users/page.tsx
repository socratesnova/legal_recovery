"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface BankUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  lastLogin: string;
  active: boolean;
  initials: string;
}

const bankUsers: BankUser[] = [
  {
    id: "u1",
    name: "Director de Riesgo",
    email: "riesgo@bancopopular.do",
    role: "admin",
    roleLabel: "Administrador",
    lastLogin: "Hoy, 08:30 AM",
    active: true,
    initials: "DR",
  },
  {
    id: "u2",
    name: "Gerente de Cobro",
    email: "cobro@bancopopular.do",
    role: "manager",
    roleLabel: "Gerente",
    lastLogin: "Hoy, 09:15 AM",
    active: true,
    initials: "GC",
  },
  {
    id: "u3",
    name: "Analista Cartera 1",
    email: "analista1@bancopopular.do",
    role: "analyst",
    roleLabel: "Analista",
    lastLogin: "Ayer, 05:45 PM",
    active: true,
    initials: "A1",
  },
  {
    id: "u4",
    name: "Analista Cartera 2",
    email: "analista2@bancopopular.do",
    role: "analyst",
    roleLabel: "Analista",
    lastLogin: "Hoy, 10:00 AM",
    active: true,
    initials: "A2",
  },
  {
    id: "u5",
    name: "Legal Advisor",
    email: "legal@bancopopular.do",
    role: "legal",
    roleLabel: "Legal",
    lastLogin: "Hoy, 07:50 AM",
    active: true,
    initials: "LA",
  },
  {
    id: "u6",
    name: "Compliance Officer",
    email: "compliance@bancopopular.do",
    role: "compliance",
    roleLabel: "Compliance",
    lastLogin: "Hoy, 08:10 AM",
    active: true,
    initials: "CO",
  },
  {
    id: "u7",
    name: "Report Viewer",
    email: "reportes@bancopopular.do",
    role: "viewer",
    roleLabel: "Visualizador",
    lastLogin: "Ayer, 03:20 PM",
    active: true,
    initials: "RV",
  },
  {
    id: "u8",
    name: "Intern (temp)",
    email: "interno@bancopopular.do",
    role: "intern",
    roleLabel: "Pasante",
    lastLogin: "Hace 15 días",
    active: false,
    initials: "IN",
  },
];

const stats = {
  total: bankUsers.length,
  active: bankUsers.filter((u) => u.active).length,
  inactive: bankUsers.filter((u) => !u.active).length,
  roles: new Set(bankUsers.map((u) => u.role)).size,
};

const roles = [
  {
    id: "admin",
    name: "Administrador",
    description: "Control total del portal",
    permissions: [
      "Ver carteras",
      "Editar carteras",
      "Gestionar usuarios",
      "Ver reportes",
      "Exportar datos",
      "Configurar sistema",
      "Aprobar acuerdos",
      "Auditar acciones",
    ],
  },
  {
    id: "manager",
    name: "Gerente",
    description: "Supervisión operativa",
    permissions: [
      "Ver carteras",
      "Editar carteras",
      "Gestionar usuarios",
      "Ver reportes",
      "Exportar datos",
      "Configurar sistema",
      "Aprobar acuerdos",
      "Auditar acciones",
    ],
  },
  {
    id: "analyst",
    name: "Analista",
    description: "Análisis de cartera",
    permissions: [
      "Ver carteras",
      "Editar carteras",
      "Gestionar usuarios",
      "Ver reportes",
      "Exportar datos",
      "Configurar sistema",
      "Aprobar acuerdos",
      "Auditar acciones",
    ],
  },
  {
    id: "legal",
    name: "Legal",
    description: "Gestión jurídica",
    permissions: [
      "Ver carteras",
      "Editar carteras",
      "Gestionar usuarios",
      "Ver reportes",
      "Exportar datos",
      "Configurar sistema",
      "Aprobar acuerdos",
      "Auditar acciones",
    ],
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Cumplimiento normativo",
    permissions: [
      "Ver carteras",
      "Editar carteras",
      "Gestionar usuarios",
      "Ver reportes",
      "Exportar datos",
      "Configurar sistema",
      "Aprobar acuerdos",
      "Auditar acciones",
    ],
  },
  {
    id: "viewer",
    name: "Visualizador",
    description: "Solo lectura",
    permissions: [
      "Ver carteras",
      "Editar carteras",
      "Gestionar usuarios",
      "Ver reportes",
      "Exportar datos",
      "Configurar sistema",
      "Aprobar acuerdos",
      "Auditar acciones",
    ],
  },
];

function RolePermissionCheck({
  granted,
  label,
}: {
  granted: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          granted
            ? "border-indigo-600 bg-indigo-600"
            : "border-slate-300 bg-slate-100"
        }`}
      >
        {granted && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
      <span
        className={`text-xs ${granted ? "text-slate-700" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "admin":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "manager":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "analyst":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "legal":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "compliance":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "viewer":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function UserStatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Activo
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
      <XCircle className="mr-1 h-3 w-3" />
      Inactivo
    </Badge>
  );
}

function EditButton() {
  return (
    <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="inline-block">
              <Button
                size="sm"
                disabled
                className="bg-indigo-700 text-white disabled:opacity-50"
              >
                Editar
              </Button>
            </span>
          </TooltipTrigger>
        <TooltipContent>Próximamente</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function BankUsersPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Usuarios del Banco
            </h1>
            <p className="text-sm text-slate-500">
              Administración de accesos institucionales
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-block">
                  <Button
                    disabled
                    className="bg-indigo-700 text-white disabled:opacity-50"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Usuario
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Próximamente</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-l-4 border-l-indigo-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Total usuarios
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {stats.total}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Activos
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {stats.active}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Inactivos
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {stats.inactive}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Roles
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {stats.roles}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Último acceso
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bankUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={getRoleBadgeClass(user.role)}
                    >
                      {user.roleLabel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <UserStatusBadge active={user.active} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <EditButton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {bankUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                      <UserStatusBadge active={user.active} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={getRoleBadgeClass(user.role)}
                      >
                        {user.roleLabel}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {user.lastLogin}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <EditButton />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Roles & Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-base">Roles y Permisos</CardTitle>
            </div>
            <CardDescription>
              Matriz de permisos por rol de usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roles.map((role) => {
                const roleUserCount = bankUsers.filter(
                  (u) => u.role === role.id
                ).length;
                return (
                  <div
                    key={role.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {role.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getRoleBadgeClass(role.id)}
                          >
                            {roleUserCount} usuario
                            {roleUserCount !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {role.permissions.map((perm) => {
                        const granted =
                          role.id === "admin" ||
                          role.id === "manager" ||
                          (role.id === "analyst" &&
                            ["Ver carteras", "Editar carteras", "Ver reportes"].includes(perm)) ||
                          (role.id === "legal" &&
                            ["Ver carteras", "Ver reportes", "Aprobar acuerdos"].includes(perm)) ||
                          (role.id === "compliance" &&
                            ["Ver carteras", "Ver reportes", "Auditar acciones"].includes(perm)) ||
                          (role.id === "viewer" && perm === "Ver carteras");
                        return (
                          <RolePermissionCheck
                            key={perm}
                            granted={granted}
                            label={perm}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
