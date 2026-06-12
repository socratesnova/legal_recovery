"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BankSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-indigo-900">Configuración del Banco</h1>
        <p className="text-muted-foreground mt-1">
          Define las reglas, canales y parámetros operativos para la recuperación legal.
        </p>
      </div>

      <Tabs defaultValue="discounts" className="w-full">
        <TabsList className="bg-indigo-50 text-indigo-900">
          <TabsTrigger value="discounts" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Descuentos
          </TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Canales
          </TabsTrigger>
          <TabsTrigger value="sla" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            SLA y Tiempos
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Política de Descuentos */}
        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">Política de Descuentos</CardTitle>
              <CardDescription>
                Límites de descuento aprobados para negociaciones de recuperación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-indigo-800">Descuento máximo auto-aprobado</Label>
                  <Input value="30%" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Descuento máximo con aprobación</Label>
                  <Input value="50%" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Descuento mínimo</Label>
                  <Input value="5%" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Aprobación requerida sobre</Label>
                  <Input value="RD$500,000" disabled className="bg-slate-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Canales Permitidos */}
        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">Canales Permitidos</CardTitle>
              <CardDescription>
                Activa o desactiva los canales de comunicación habilitados para este banco.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label className="text-base text-indigo-900">Portal</Label>
                  <p className="text-sm text-muted-foreground">Acceso directo del deudor al portal.</p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label className="text-base text-indigo-900">Email</Label>
                  <p className="text-sm text-muted-foreground">Comunicaciones por correo electrónico.</p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label className="text-base text-indigo-900">SMS</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones cortas por mensaje de texto.</p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label className="text-base text-indigo-900">Llamadas</Label>
                  <p className="text-sm text-muted-foreground">Contacto telefónico directo.</p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-slate-50 opacity-70">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-base text-indigo-900">WhatsApp</Label>
                    <Badge variant="secondary">Restringido</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Canal restringido por política institucional.</p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
                <div className="space-y-0.5">
                  <Label className="text-base text-indigo-900">Cartas QR</Label>
                  <p className="text-sm text-muted-foreground">Correspondencia física con código QR.</p>
                </div>
                <Switch checked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA y Tiempos */}
        <TabsContent value="sla">
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">SLA y Tiempos</CardTitle>
              <CardDescription>
                Tiempos de respuesta establecidos para cada etapa del proceso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-indigo-800">Primer contacto</Label>
                  <Input value="48 horas" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Seguimiento</Label>
                  <Input value="7 días" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Respuesta a acuerdo</Label>
                  <Input value="24 horas" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Resolución de disputa</Label>
                  <Input value="15 días" disabled className="bg-slate-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos Requeridos */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">Documentos Requeridos</CardTitle>
              <CardDescription>
                Listado de documentos obligatorios y opcionales para iniciar un caso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Contrato", type: "required" },
                { label: "Pagaré", type: "required" },
                { label: "Cesión", type: "required" },
                { label: "Estado de cuenta", type: "required" },
                { label: "Garantía", type: "optional" },
              ].map((doc) => (
                <div key={doc.label} className="flex items-center justify-between rounded-lg border p-4 bg-white">
                  <span className="font-medium text-indigo-900">{doc.label}</span>
                  <Badge variant={doc.type === "required" ? "destructive" : "outline"}>
                    {doc.type === "required" ? "Requerido ✓" : "Opcional"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">Notificaciones</CardTitle>
              <CardDescription>
                Configuración de alertas y reportes automáticos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-indigo-800">Email para reportes</Label>
                  <Input value="director@bpd.com.do" disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-indigo-800">Frecuencia</Label>
                  <Input value="Semanal" disabled className="bg-slate-50" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-indigo-800">Alertas activas</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">Nuevos acuerdos</Badge>
                  <Badge variant="secondary">Disputas</Badge>
                  <Badge variant="secondary">SLA breaches</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
