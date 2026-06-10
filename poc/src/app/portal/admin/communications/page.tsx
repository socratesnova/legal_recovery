"use client";

import {
  MessageSquare,
  Mail,
  Phone,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Filter,
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
import { demoCommunications, demoCases, formatDateTime } from "@/lib/seed-data";

const channelIcon: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4 text-blue-500" />,
  call: <Phone className="w-4 h-4 text-amber-500" />,
  sms: <Smartphone className="w-4 h-4 text-purple-500" />,
  whatsapp: <MessageSquare className="w-4 h-4 text-green-500" />,
};

export default function CommunicationsPage() {
  const blocked = demoCommunications.filter((c) => c.status === "blocked");
  const delivered = demoCommunications.filter((c) => c.status === "delivered");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comunicaciones</h1>
          <p className="text-sm text-slate-500 mt-1">
            Historial de comunicaciones y bloqueos del Legal Firewall
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <ShieldAlert className="w-3 h-3 mr-1" />
            {blocked.length} bloqueos
          </Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {delivered.length} enviados
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-slate-900">{demoCommunications.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total Comunicaciones</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-600">{blocked.length}</p>
            <p className="text-sm text-slate-500 mt-1">Bloqueadas por Legal Firewall</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-emerald-600">{delivered.length}</p>
            <p className="text-sm text-slate-500 mt-1">Entregadas Exitosamente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Comunicaciones</CardTitle>
          <CardDescription>Todas las comunicaciones intentadas, incluyendo bloqueos del Legal Firewall</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Expediente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoCommunications.map((comm) => {
                const caseData = demoCases.find((c) => c.id === comm.caseId);
                return (
                  <TableRow key={comm.id} className={comm.status === "blocked" ? "bg-red-50/50" : ""}>
                    <TableCell className="text-xs text-slate-500">
                      {formatDateTime(comm.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {channelIcon[comm.channel]}
                        <span className="text-sm capitalize">{comm.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{caseData?.debtor.name}</span>
                    </TableCell>
                    <TableCell>
                      {comm.status === "blocked" ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Bloqueado
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Entregado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {comm.status === "blocked" ? (
                        <p className="text-xs text-red-600 leading-relaxed">{comm.blockedReason}</p>
                      ) : (
                        <p className="text-xs text-slate-600">{comm.content}</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}