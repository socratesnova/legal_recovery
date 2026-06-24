"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  ShieldCheck,
  Fingerprint,
  Mail,
  Phone,
  Lock,
  Save,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
} from "lucide-react";

export default function DebtorProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-sm text-slate-500">Administra tus datos de contacto y seguridad</p>
        </div>
        <Button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white">
          <Save className="w-4 h-4 mr-2" /> Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-col items-center gap-4 mb-4 sm:flex-row sm:items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-700">JP</div>
              <div>
                <p className="font-bold text-slate-900">Juan Pérez</p>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Identidad Verificada
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input value="Juan Pérez" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label>Cédula</Label>
              <Input value="001-1234567-8" disabled className="w-full bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input value="juan.perez@demo.rd" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value="+1-809-555-0100" className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">Verificación de Identidad Completada</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">Tu identidad fue verificada el 10 de junio de 2026 mediante cédula + pregunta de seguridad.</p>
            </div>

            <div className="space-y-2">
              <Label>Cambiar contraseña</Label>
              <Input type="password" placeholder="Nueva contraseña" className="w-full" />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm font-bold text-slate-900">Preferencias de contacto:</p>
              <div className="space-y-2 mt-2">
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-600">Email</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Autorizado</Badge>
                </div>
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-600">SMS</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Autorizado</Badge>
                </div>
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-600">WhatsApp</span>
                  <Badge className="bg-amber-100 text-amber-800 text-[10px]">Pendiente</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
