"use client";

import {
  Settings,
  Building2,
  ShieldCheck,
  Scale,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  KeyRound,
  Globe,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Save,
  Eye,
  Fingerprint,
  BadgeCheck,
  Ban,
  DollarSign,
  Percent,
  FileText,
  UserCheck,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { demoInstitution } from "@/lib/seed-data";

const channelSettings = [
  { channel: "portal", label: "Portal Web", enabled: true, cost: 5, conversion: 25, icon: <Globe className="w-4 h-4 text-blue-500" /> },
  { channel: "email", label: "Email", enabled: true, cost: 12, conversion: 18, icon: <Mail className="w-4 h-4 text-amber-500" /> },
  { channel: "call", label: "Llamada", enabled: true, cost: 45, conversion: 22, icon: <Phone className="w-4 h-4 text-emerald-500" /> },
  { channel: "sms", label: "SMS", enabled: true, cost: 25, conversion: 8, icon: <MessageSquare className="w-4 h-4 text-purple-500" /> },
  { channel: "whatsapp", label: "WhatsApp", enabled: false, cost: 15, conversion: 12, icon: <Smartphone className="w-4 h-4 text-green-500" />, restricted: true },
];

const agreementRules = {
  maxDiscountAuto: 30,
  maxDiscountManual: 50,
  minInstallments: 1,
  maxInstallments: 6,
  autoApprovalLimit: 100000,
  requireSupervisorAbove: 50000,
};

const slaSettings = {
  responseTimeHours: 24,
  firstContactDays: 3,
  agreementResponseDays: 2,
  disputeResolutionDays: 15,
  paymentReconciliationDays: 1,
};

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
            <p className="text-sm text-slate-500">
              Reglas de institución, canales de contacto, SLA y parámetros de negocio
            </p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="institution" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="institution" className="gap-1">
            <Building2 className="w-4 h-4" /> Institución
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-1">
            <Mail className="w-4 h-4" /> Canales
          </TabsTrigger>
          <TabsTrigger value="agreements" className="gap-1">
            <FileText className="w-4 h-4" /> Acuerdos
          </TabsTrigger>
          <TabsTrigger value="sla" className="gap-1">
            <Clock className="w-4 h-4" /> SLA
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <ShieldCheck className="w-4 h-4" /> Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="institution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Datos de la Institución
              </CardTitle>
              <CardDescription>Información legal y contractual de la institución cedente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de la institución</Label>
                  <Input value={demoInstitution.name} />
                </div>
                <div className="space-y-2">
                  <Label>ID de institución</Label>
                  <Input value={demoInstitution.id} disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Input value="Banco múltiple" />
                </div>
                <div className="space-y-2">
                  <Label>País</Label>
                  <Input value="República Dominicana" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Canales de Contacto
              </CardTitle>
              <CardDescription>
                Configura qué canales están habilitados, sus costos y tasas de conversión. Orden de prioridad: más barato primero.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {channelSettings.map((ch) => (
                <div key={ch.channel} className={`p-4 rounded-lg border ${ch.restricted ? "border-amber-200 bg-amber-50/50" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        {ch.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{ch.label}</span>
                          {ch.restricted && (
                            <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Restringido
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>Costo: <strong>${ch.cost}</strong>/contacto</span>
                          <span>Conversión: <strong>{ch.conversion}%</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{ch.enabled ? "Habilitado" : "Deshabilitado"}</span>
                        <Switch checked={ch.enabled} disabled={ch.restricted} />
                      </div>
                    </div>
                  </div>
                  {ch.restricted && (
                    <p className="text-xs text-amber-700 mt-2">
                      WhatsApp requiere opt-in explícito + plantillas aprobadas por Meta. Prohibido para cobranza de deudas según WhatsApp Business Policy.
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Reglas de Acuerdos y Descuentos
              </CardTitle>
              <CardDescription>Límites de descuento, cuotas y aprobaciones automáticas vs manuales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900">Descuento máximo (auto)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={agreementRules.maxDiscountAuto} className="w-24 text-center" />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Acuerdos con descuento ≤30% se aprueban automáticamente</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-slate-900">Descuento máximo (manual)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={agreementRules.maxDiscountManual} className="w-24 text-center" />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Requiere aprobación de supervisor si descuento {'>'}30%</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-900">Monto auto-aprobación</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={agreementRules.autoApprovalLimit} className="w-32 text-center" />
                    <span className="text-sm text-slate-500">DOP</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Acuerdos {'≤'}RD$100,000 se aprueban automáticamente</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">Requiere supervisor si {'>'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={agreementRules.requireSupervisorAbove} className="w-32 text-center" />
                    <span className="text-sm text-slate-500">DOP</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Acuerdos {'>'}RD$50,000 requieren supervisor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Service Level Agreements (SLA)
              </CardTitle>
              <CardDescription>Tiempos de respuesta y resolución comprometidos con la institución</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Tiempo de respuesta", value: slaSettings.responseTimeHours, unit: "horas", desc: "Respuesta a consultas del deudor" },
                  { label: "Primer contacto", value: slaSettings.firstContactDays, unit: "días", desc: "Desde carga de cartera" },
                  { label: "Respuesta a acuerdo", value: slaSettings.agreementResponseDays, unit: "días", desc: "Tiempo para responder propuesta" },
                  { label: "Resolución de disputa", value: slaSettings.disputeResolutionDays, unit: "días", desc: "Tiempo máximo para resolver" },
                  { label: "Conciliación de pago", value: slaSettings.paymentReconciliationDays, unit: "día", desc: "Tiempo para conciliar pago" },
                ].map((sla) => (
                  <div key={sla.label} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900">{sla.label}</span>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={sla.value} className="w-20 text-center" />
                        <span className="text-sm text-slate-500">{sla.unit}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{sla.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>MFA, políticas de contraseña, encriptación y auditoría</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">MFA Obligatorio</p>
                      <p className="text-xs text-slate-500">Todos los usuarios deben usar autenticación de dos factores</p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Encriptación AES-256</p>
                      <p className="text-xs text-slate-500">Datos en reposo y tránsito encriptados</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Data Passport obligatorio</p>
                      <p className="text-xs text-slate-500">Todos los datos deben tener pasaporte con fuente y base legal</p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Legal Firewall</p>
                      <p className="text-xs text-slate-500">Verificación automática de todos los contactos</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Ban className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Bloqueo automático de datos JCE</p>
                      <p className="text-xs text-slate-500">Datos de JCE no pueden usarse para contacto comercial</p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
