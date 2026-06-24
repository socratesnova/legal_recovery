"use client";

import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Mail,
  Phone,
  BadgeCheck,
  Ban,
  Eye,
  Pencil,
  Trash2,
  Fingerprint,
  Globe,
  GraduationCap,
  ArrowRight,
  Zap,
  Target,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { demoUsers, demoInstitution } from "@/lib/seed-data";
import { useState } from "react";

const allUsers = [
  ...demoUsers,
  {
    id: "user-003",
    email: "supervisor@legalrecovery.rd",
    name: "Lic. Ana López",
    role: "supervisor",
    institutionId: "inst-001",
    status: "active",
    lastLogin: "2026-06-09T10:30:00Z",
    mfaEnabled: true,
    permissions: ["view_cases", "edit_cases", "approve_agreements", "view_reports"],
  },
  {
    id: "user-004",
    email: "gestor2@legalrecovery.rd",
    name: "Luis Martínez",
    role: "gestor",
    institutionId: "inst-001",
    status: "active",
    lastLogin: "2026-06-09T09:15:00Z",
    mfaEnabled: false,
    permissions: ["view_cases", "edit_cases", "send_communications"],
  },
  {
    id: "user-005",
    email: "compliance@legalrecovery.rd",
    name: "Dra. Patricia Ruiz",
    role: "compliance",
    institutionId: "inst-001",
    status: "active",
    lastLogin: "2026-06-09T08:00:00Z",
    mfaEnabled: true,
    permissions: ["view_all", "audit_logs", "compliance_review", "data_passport"],
  },
  {
    id: "user-006",
    email: "abogado@legalrecovery.rd",
    name: "Lic. Roberto Santos",
    role: "abogado",
    institutionId: "inst-001",
    status: "active",
    lastLogin: "2026-06-08T16:45:00Z",
    mfaEnabled: true,
    permissions: ["view_cases", "legal_actions", "disputes", "documents"],
  },
  {
    id: "user-007",
    email: "banco@bpd.com.do",
    name: "Ing. Carmen Vega",
    role: "bank_user",
    institutionId: "inst-001",
    status: "active",
    lastLogin: "2026-06-09T11:00:00Z",
    mfaEnabled: true,
    permissions: ["view_portfolios", "view_reports", "upload_portfolios"],
  },
  {
    id: "user-008",
    email: "viewer@legalrecovery.rd",
    name: "Miguel Hernández",
    role: "viewer",
    institutionId: "inst-001",
    status: "inactive",
    lastLogin: "2026-05-15T14:20:00Z",
    mfaEnabled: false,
    permissions: ["view_cases"],
  },
];

const roles = [
  {
    name: "super_admin",
    label: "Super Admin",
    description: "Control total del sistema",
    users: 1,
    permissions: ["all"],
    color: "bg-purple-100 text-purple-800",
  },
  {
    name: "supervisor",
    label: "Supervisor",
    description: "Gestión de equipo y aprobaciones",
    users: 1,
    permissions: ["view_cases", "edit_cases", "approve_agreements", "view_reports", "manage_team"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "gestor",
    label: "Gestor",
    description: "Contacto y gestión de casos",
    users: 2,
    permissions: ["view_cases", "edit_cases", "send_communications", "create_agreements"],
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    name: "compliance",
    label: "Compliance",
    description: "Auditoría y normativa",
    users: 1,
    permissions: ["view_all", "audit_logs", "compliance_review", "data_passport"],
    color: "bg-amber-100 text-amber-800",
  },
  {
    name: "abogado",
    label: "Abogado",
    description: "Acciones legales y disputas",
    users: 1,
    permissions: ["view_cases", "legal_actions", "disputes", "documents"],
    color: "bg-red-100 text-red-800",
  },
  {
    name: "bank_user",
    label: "Usuario Banco",
    description: "Vista del banco cedente",
    users: 1,
    permissions: ["view_portfolios", "view_reports", "upload_portfolios"],
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    name: "viewer",
    label: "Viewer",
    description: "Solo lectura",
    users: 1,
    permissions: ["view_cases"],
    color: "bg-slate-100 text-slate-800",
  },
];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<typeof allUsers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsers = allUsers.filter((u) => (u as any).status === "active").length;
  const mfaEnabled = allUsers.filter((u) => (u as any).mfaEnabled).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Usuarios y Roles</h1>
              <p className="text-sm text-slate-500">
                RBAC/ABAC: Gestión de usuarios, roles, permisos y acceso multi-institución
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Invitar Usuario
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Total Usuarios</p>
                <p className="text-2xl font-bold text-slate-900">{allUsers.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">{activeUsers} activos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">MFA Habilitado</p>
                <p className="text-2xl font-bold text-slate-900">{mfaEnabled}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{mfaEnabled}/{allUsers.length} usuarios</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Roles</p>
                <p className="text-2xl font-bold text-slate-900">{roles.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Configurables por institución</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Institución</p>
                <p className="text-lg font-bold text-slate-900 truncate">{demoInstitution.name}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Multi-tenant activo</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <Button variant={activeTab === "users" ? "default" : "ghost"} size="sm" className={activeTab === "users" ? "bg-indigo-600" : ""} onClick={() => setActiveTab("users")}>
          <Users className="w-4 h-4 mr-1" /> Usuarios
        </Button>
        <Button variant={activeTab === "roles" ? "default" : "ghost"} size="sm" className={activeTab === "roles" ? "bg-indigo-600" : ""} onClick={() => setActiveTab("roles")}>
          <Shield className="w-4 h-4 mr-1" /> Roles y Permisos
        </Button>
        <Button variant={activeTab === "abac" ? "default" : "ghost"} size="sm" className={activeTab === "abac" ? "bg-indigo-600" : ""} onClick={() => setActiveTab("abac")}>
          <Fingerprint className="w-4 h-4 mr-1" /> ABAC
        </Button>
      </div>

      {activeTab === "users" && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar usuario..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" /> Filtros
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleInfo = roles.find((r) => r.name === user.role);
                    const userStatus = (user as any).status || "active";
                    const userMfa = (user as any).mfaEnabled || false;
                    return (
                      <TableRow key={user.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${roleInfo?.color || "bg-slate-100 text-slate-800"}`}>
                            {roleInfo?.label || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={userStatus === "active" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-slate-100 text-slate-800 text-[10px]"}>
                            {userStatus === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {userMfa ? (
                            <div className="flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs text-emerald-600">Activado</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <ShieldAlert className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-amber-600">Pendiente</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs text-slate-500">
                            {(user as any).lastLogin ? new Date((user as any).lastLogin).toLocaleDateString("es-DO") : "Nunca"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {((user as any).permissions || []).slice(0, 2).map((p: string) => (
                              <Badge key={p} variant="outline" className="text-[10px]">
                                {p}
                              </Badge>
                            ))}
                            {((user as any).permissions || []).length > 2 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{((user as any).permissions || []).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "roles" && (
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card key={role.name} className="border-l-4 border-l-indigo-400">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-[10px] ${role.color}`}>{role.label}</Badge>
                      <span className="text-xs text-slate-500">{role.users} usuario{role.users > 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">{role.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-[10px]">
                          {perm === "all" ? "✓ Todos los permisos" : perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "abac" && (
        <div className="space-y-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-purple-600" />
                ABAC — Attribute-Based Access Control
              </CardTitle>
              <CardDescription>
                Acceso basado en atributos: rol + institución + cartera + sensibilidad del dato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Sujeto (Usuario)</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Rol</span>
                      <Badge className="bg-indigo-100 text-indigo-800 text-[10px]">super_admin</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Institución</span>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Banco Popular</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Carteras asignadas</span>
                      <span className="font-medium text-slate-900">Todas</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Nivel de sensibilidad</span>
                      <Badge className="bg-red-100 text-red-800 text-[10px]">Alta</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Recurso (Dato)</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Tipo</span>
                      <Badge className="bg-amber-100 text-amber-800 text-[10px]">Contacto</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Fuente</span>
                      <Badge className="bg-blue-100 text-blue-800 text-[10px]">JCE</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Data Passport</span>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Restricciones</span>
                      <Badge className="bg-red-100 text-red-800 text-[10px]">no_contact</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-2">Decisión</p>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                      <Ban className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-sm font-bold text-red-700">ACCESO DENEGADO</p>
                    <p className="text-xs text-red-600 mt-1">
                      Dato JCE con restricción no_contact. Rol gestor no tiene permiso para acceder a datos de JCE con restricciones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-bold text-slate-900 mb-2">Regla ABAC evaluada:</p>
                <code className="text-xs bg-slate-100 p-2 rounded block">
                  canAccess(user, resource, action) = user.role.hasPermission("data_sensitive") &&
                  resource.source !== "JCE" &&
                  !resource.restrictions.includes("no_contact") &&
                  user.institution_id === resource.institution_id
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {selectedUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  {selectedUser.name}
                </DialogTitle>
                <DialogDescription>{selectedUser.email} · {(selectedUser as any).role}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Estado</p>
                    <Badge className={(selectedUser as any).status === "active" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-slate-100 text-slate-800 text-[10px]"}>
                      {(selectedUser as any).status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">MFA</p>
                    <Badge className={(selectedUser as any).mfaEnabled ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                      {(selectedUser as any).mfaEnabled ? "Activado" : "Pendiente"}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Último acceso</p>
                    <p className="text-sm font-medium">
                      {(selectedUser as any).lastLogin ? new Date((selectedUser as any).lastLogin).toLocaleString("es-DO") : "Nunca"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Institución</p>
                    <p className="text-sm font-medium">{demoInstitution.name}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-sm font-medium text-slate-900 mb-2">Permisos:</p>
                  <div className="flex flex-wrap gap-1">
                    {((selectedUser as any).permissions || []).map((p: string) => (
                      <Badge key={p} variant="outline" className="text-[10px]">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}