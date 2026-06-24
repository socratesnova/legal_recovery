"use client";

import {
  Shield,
  Database,
  FileCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Activity,
  Landmark,
  Users,
  Clock,
  ExternalLink,
  ShieldCheck,
  XCircle,
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
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { formatDate } from "@/lib/seed-data";
import { useState, useEffect } from "react";

interface DataPassport {
  id: string;
  caseId: string;
  debtor: string;
  source: string;
  legalBasis: string;
  status: "active" | "restricted" | "disputed" | "review";
  protectedFields: number;
  totalFields: number;
  createdAt: string;
}

const passports: DataPassport[] = [
  {
    id: "dp-001",
    caseId: "case-001",
    debtor: "Juan Pérez",
    source: "Banco cedente",
    legalBasis: "Mandato gestión",
    status: "active",
    protectedFields: 5,
    totalFields: 5,
    createdAt: "2026-06-01",
  },
  {
    id: "dp-002",
    caseId: "case-002",
    debtor: "María García",
    source: "JCE",
    legalBasis: "Consulta admin",
    status: "restricted",
    protectedFields: 0,
    totalFields: 8,
    createdAt: "2026-06-01",
  },
  {
    id: "dp-003",
    caseId: "case-003",
    debtor: "Pedro Martínez",
    source: "Banco cedente",
    legalBasis: "Mandato",
    status: "disputed",
    protectedFields: 0,
    totalFields: 12,
    createdAt: "2026-06-01",
  },
  {
    id: "dp-004",
    caseId: "case-012",
    debtor: "Ana López",
    source: "Banco cedente",
    legalBasis: "Mandato",
    status: "active",
    protectedFields: 4,
    totalFields: 4,
    createdAt: "2026-06-02",
  },
  {
    id: "dp-005",
    caseId: "case-013",
    debtor: "Carlos Ruiz",
    source: "Banco cedente",
    legalBasis: "Mandato",
    status: "active",
    protectedFields: 6,
    totalFields: 6,
    createdAt: "2026-06-02",
  },
  {
    id: "dp-006",
    caseId: "case-014",
    debtor: "Laura Santos",
    source: "Banco cedente",
    legalBasis: "Mandato",
    status: "active",
    protectedFields: 3,
    totalFields: 3,
    createdAt: "2026-06-03",
  },
  {
    id: "dp-007",
    caseId: "case-015",
    debtor: "Juan Pérez (BHD)",
    source: "BHD",
    legalBasis: "Mandato",
    status: "active",
    protectedFields: 5,
    totalFields: 5,
    createdAt: "2026-06-04",
  },
  {
    id: "dp-008",
    caseId: "TSS feed",
    debtor: "Generic",
    source: "TSS",
    legalBasis: "Resolución 23-2024",
    status: "review",
    protectedFields: 0,
    totalFields: 120,
    createdAt: "2026-06-05",
  },
];

const recentActivity = [
  {
    id: "evt-001",
    event: "Data passport creado",
    target: "Juan Pérez (BHD)",
    caseId: "case-015",
    timestamp: "2026-06-04T09:15:00Z",
    type: "created",
  },
  {
    id: "evt-002",
    event: "Campos restringidos",
    target: "María García",
    caseId: "case-002",
    timestamp: "2026-06-03T14:22:00Z",
    type: "restricted",
  },
  {
    id: "evt-003",
    event: "Data passport actualizado",
    target: "Ana López",
    caseId: "case-012",
    timestamp: "2026-06-03T11:00:00Z",
    type: "updated",
  },
  {
    id: "evt-004",
    event: "Caso en disputa — todos los campos bloqueados",
    target: "Pedro Martínez",
    caseId: "case-003",
    timestamp: "2026-06-02T16:45:00Z",
    type: "disputed",
  },
  {
    id: "evt-005",
    event: "Auditoría de cumplimiento ejecutada",
    target: "Sistema",
    caseId: "—",
    timestamp: "2026-06-01T08:00:00Z",
    type: "audit",
  },
];

const sourceDistribution = [
  { name: "Banco cedente", count: 6, color: "bg-emerald-500" },
  { name: "JCE", count: 1, color: "bg-blue-500" },
  { name: "TSS", count: 1, color: "bg-amber-500" },
  { name: "Externo", count: 0, color: "bg-slate-400" },
];

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; badgeClass: string; iconColor: string }
> = {
  active: {
    label: "Activo",
    icon: <CheckCircle2 className="w-4 h-4" />,
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  restricted: {
    label: "Restringido",
    icon: <AlertTriangle className="w-4 h-4" />,
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    iconColor: "text-amber-600",
  },
  disputed: {
    label: "Disputado",
    icon: <Lock className="w-4 h-4" />,
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    iconColor: "text-red-600",
  },
  review: {
    label: "Revisión pendiente",
    icon: <Clock className="w-4 h-4" />,
    badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    iconColor: "text-slate-600",
  },
};

const eventIcon: Record<string, React.ReactNode> = {
  created: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
  updated: <Activity className="w-4 h-4 text-blue-500 flex-shrink-0" />,
  restricted: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  disputed: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  audit: <ShieldCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />,
};

const eventBadgeClass: Record<string, string> = {
  created: "text-emerald-700 border-emerald-200",
  updated: "text-blue-700 border-blue-200",
  restricted: "text-amber-700 border-amber-200",
  disputed: "text-red-700 border-red-200",
  audit: "text-slate-700 border-slate-200",
};

export default function DataPassportPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const total = passports.length;
  const active = passports.filter((p) => p.status === "active").length;
  const restricted = passports.filter((p) => p.status === "restricted").length;
  const disputed = passports.filter((p) => p.status === "disputed").length;
  const fieldsProtected = passports.reduce((sum, p) => sum + p.protectedFields, 0);
  const sourcesConnected = new Set(passports.map((p) => p.source)).size;

  const totalFields = passports.reduce((sum, p) => sum + p.totalFields, 0);
  const complianceRate = totalFields > 0 ? Math.round((fieldsProtected / totalFields) * 10000) / 100 : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-700" />
            Centro de Data Passport
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gobierno y trazabilidad de datos sensibles
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 w-fit"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          Legal Firewall Active
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Total
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Activos
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Restringidos
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{restricted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50/50 to-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Disputados
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{disputed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Campos prot.
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{fieldsProtected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-500 bg-gradient-to-br from-slate-50/50 to-white">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Fuentes
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{sourcesConnected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Passport List — Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Data Passports
          </CardTitle>
          <CardDescription>
            Todos los pasaportes de datos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caso / Deudor</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Base legal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Campos</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passports.map((p) => {
                const cfg = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{p.debtor}</p>
                        <p className="text-xs text-slate-400">{p.caseId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{p.source}</TableCell>
                    <TableCell className="text-sm text-slate-700">{p.legalBasis}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cfg.badgeClass}>
                        {cfg.icon}
                        <span className="ml-1">{cfg.label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-700">
                        {p.protectedFields}/{p.totalFields}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {formatDate(p.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-emerald-700 text-white hover:bg-emerald-800 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Passport List — Mobile Cards */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-semibold text-slate-800">Data Passports</h2>
        </div>
        {passports.map((p) => {
          const cfg = statusConfig[p.status];
          return (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{p.debtor}</p>
                    <p className="text-xs text-slate-400">{p.caseId}</p>
                  </div>
                  <Badge variant="outline" className={cfg.badgeClass}>
                    {cfg.icon}
                    <span className="ml-1">{cfg.label}</span>
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Fuente</p>
                    <p className="text-slate-700">{p.source}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Base legal</p>
                    <p className="text-slate-700">{p.legalBasis}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Campos</p>
                    <p className="text-slate-700">{p.protectedFields}/{p.totalFields}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Creado</p>
                    <p className="text-slate-700">{formatDate(p.createdAt)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-emerald-700 text-white hover:bg-emerald-800 text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Ver Detalle
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Source Distribution + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Distribución por Fuente
            </CardTitle>
            <CardDescription>
              Origen de los datos en los pasaportes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceDistribution.map((src) => {
                const max = Math.max(...sourceDistribution.map((s) => s.count));
                const pct = max > 0 ? (src.count / max) * 100 : 0;
                return (
                  <div key={src.name} className="flex items-center gap-3">
                    <div className="w-24 md:w-28 flex-shrink-0">
                      <p className="text-sm font-medium text-slate-900">{src.name}</p>
                      <p className="text-xs text-slate-500">{src.count} passport(s)</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${src.color} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card className="bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Cumplimiento Documentado
            </CardTitle>
            <CardDescription className="text-emerald-700/70">
              Campos con fuente legal verificada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-800">
                {complianceRate}%
              </span>
              <span className="text-sm text-emerald-600">
                de campos con fuente legal documentada
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-emerald-700 font-medium">
                  Documentado / Total
                </span>
                <span className="text-xs text-emerald-700 font-bold">
                  {fieldsProtected} / {totalFields}
                </span>
              </div>
              <Progress value={complianceRate}>
                <ProgressTrack className="bg-emerald-100">
                  <ProgressIndicator className="bg-emerald-600" />
                </ProgressTrack>
              </Progress>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-100/60 border border-emerald-200">
              <FileCheck className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-800 leading-relaxed">
                Todos los campos activos cuentan con base legal documentada. Los
                campos bloqueados o en revisión están excluidos del cálculo hasta
                su verificación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-600" />
              Actividad Reciente
            </CardTitle>
          </div>
          <CardDescription>Últimos eventos en pasaportes de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                {eventIcon[evt.type]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-900">
                      {evt.event}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${eventBadgeClass[evt.type]}`}
                    >
                      {evt.type === "created"
                        ? "Creado"
                        : evt.type === "updated"
                        ? "Actualizado"
                        : evt.type === "restricted"
                        ? "Restringido"
                        : evt.type === "disputed"
                        ? "Disputa"
                        : "Auditoría"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {evt.target} · {evt.caseId !== "—" ? evt.caseId : "Sistema"} ·{" "}
                    {formatDate(evt.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
