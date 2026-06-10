"use client";

import {
  FileText,
  User,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
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
import { demoAuditLog, formatDateTime } from "@/lib/seed-data";

const resultIcons: Record<string, React.ReactNode> = {
  allowed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  blocked: <XCircle className="w-4 h-4 text-red-500" />,
  "auto-logged": <FileText className="w-4 h-4 text-blue-500" />,
  "auto-blocked": <Shield className="w-4 h-4 text-red-500" />,
};

const resultLabels: Record<string, string> = {
  allowed: "Permitido",
  blocked: "Bloqueado",
  "auto-logged": "Auto-registrado",
  "auto-blocked": "Auto-bloqueado",
};

const resultColors: Record<string, string> = {
  allowed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  "auto-logged": "bg-blue-50 text-blue-700 border-blue-200",
  "auto-blocked": "bg-red-50 text-red-700 border-red-200",
};

export default function AuditPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Auditoría Inmutable
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro inmutable de todas las acciones del sistema. Hash chain
            SHA-256.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 text-slate-600">
            <Shield className="w-3 h-3 mr-1" />
            WORM: Write Once Read Many
          </Badge>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">Total Eventos</p>
            <p className="text-2xl font-bold text-slate-900">
              {demoAuditLog.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">Acciones Permitidas</p>
            <p className="text-2xl font-bold text-emerald-600">
              {demoAuditLog.filter((l) => l.result === "allowed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">Acciones Bloqueadas</p>
            <p className="text-2xl font-bold text-red-600">
              {demoAuditLog.filter((l) => l.result === "blocked" || l.result === "auto-blocked").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">Integridad</p>
            <p className="text-2xl font-bold text-emerald-600">100%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log de Auditoría</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoAuditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs font-mono text-slate-500">
                    {formatDateTime(entry.timestamp)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-slate-400" />
                      {entry.user}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs">
                    {entry.action}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={resultColors[entry.result]}
                    >
                      <span className="flex items-center gap-1">
                        {resultIcons[entry.result]}
                        {resultLabels[entry.result]}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">
                    {entry.ip}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-xs">
                    {entry.detail || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>
              Los registros de auditoría son inmutables (hash chain SHA-256 +
              append-only PostgreSQL + WORM checkpoints en MinIO). No pueden ser
              modificados ni eliminados.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}