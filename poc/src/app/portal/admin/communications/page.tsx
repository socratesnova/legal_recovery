"use client";

import {
  MessageSquare,
  Mail,
  Phone,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Shield,
  CheckCircle2,
  Scale,
  Lock,
  FileWarning,
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

const channelLabel: Record<string, string> = {
  email: "Email",
  call: "Llamada",
  sms: "SMS",
  whatsapp: "WhatsApp",
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
            Legal Firewall protege cada contacto — solo se envían comunicaciones legales y autorizadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            {blocked.length} protecciones activas
          </Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            {delivered.length} enviados
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-emerald-700">{blocked.length}</p>
            <p className="text-sm text-emerald-600 mt-1 font-medium">Violaciones prevenidas</p>
            <p className="text-xs text-slate-500 mt-1">Ley 172-13 y Ley 659 cumplidas</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-700">{delivered.length}</p>
            <p className="text-sm text-blue-600 mt-1 font-medium">Comunicaciones exitosas</p>
            <p className="text-xs text-slate-500 mt-1">Solo canales autorizados</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="pt-6 text-center">
            <Scale className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-slate-900">100%</p>
            <p className="text-sm text-slate-600 mt-1 font-medium">Cumplimiento normativo</p>
            <p className="text-xs text-slate-500 mt-1">Cero violaciones de privacidad</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature showcase cards for blocked communications */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          Legal Firewall — Protecciones Activas
        </h2>
        {blocked.map((comm) => {
          const caseData = demoCases.find((c) => c.id === comm.caseId);
          return (
            <Card key={comm.id} className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Protección Legal Firewall
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {channelIcon[comm.channel]}
                        <span className="ml-1">{channelLabel[comm.channel]}</span>
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {comm.channel === "whatsapp" && "WhatsApp bloqueado — protección de canal restringido"}
                      {comm.channel === "sms" && "SMS bloqueado — dato sin autorización de contacto"}
                      {comm.channel === "email" && "Email bloqueado — caso con disputa activa"}
                      {comm.channel === "call" && "Llamada bloqueada — dato sin autorización"}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {comm.blockedReason}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">
                        {caseData?.debtor.name} · {formatDateTime(comm.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full history table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial Completo</CardTitle>
          <CardDescription>Todas las comunicaciones con verificación automática del Legal Firewall</CardDescription>
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
                  <TableRow key={comm.id} className={comm.status === "blocked" ? "bg-emerald-50/30" : ""}>
                    <TableCell className="text-xs text-slate-500">
                      {formatDateTime(comm.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {channelIcon[comm.channel]}
                        <span className="text-sm">{channelLabel[comm.channel]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{caseData?.debtor.name}</span>
                    </TableCell>
                    <TableCell>
                      {comm.status === "blocked" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Protegido
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Entregado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {comm.status === "blocked" ? (
                        <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                          {comm.blockedReason}
                        </p>
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