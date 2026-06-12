"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Image,
  Trash2,
  CheckCircle2,
  Clock,
  Shield,
  Lock,
} from "lucide-react";

const documentTypes = [
  "Comprobante de pago",
  "Evidencia de disputa",
  "Carta de no adeudo",
  "Otro documento",
];

const uploads = [
  {
    filename: "comprobante_pago_mayo.pdf",
    size: "2.1MB",
    date: "10 jun 2026",
    status: "Verificado",
    icon: FileText,
  },
  {
    filename: "estado_cuenta_bpd.pdf",
    size: "1.8MB",
    date: "8 jun 2026",
    status: "Verificado",
    icon: FileText,
  },
  {
    filename: "cedula_frente.jpg",
    size: "856KB",
    date: "5 jun 2026",
    status: "Verificado",
    icon: Image,
  },
  {
    filename: "cedula_reverso.jpg",
    size: "920KB",
    date: "5 jun 2026",
    status: "Pendiente",
    icon: Image,
  },
  {
    filename: "carta_disputa.pdf",
    size: "1.2MB",
    date: "9 jun 2026",
    status: "Pendiente",
    icon: FileText,
  },
];

export default function DebtorUploadPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">
            Subir Documentos
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            Adjunta comprobantes, evidencias o documentos de soporte
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="border-dashed border-2 border-emerald-200 bg-emerald-50/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-4">
              <Upload className="h-8 w-8 text-emerald-700" />
            </div>
            <p className="mb-2 text-sm font-medium text-slate-700 md:text-base">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="mb-6 text-xs text-slate-500">
              Soportado: PDF, JPG, PNG (max 10MB)
            </p>
            <Button
              disabled
              className="bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              Seleccionar archivo
            </Button>
          </CardContent>
        </Card>

        {/* Document Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-emerald-900">
              Tipo de documento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documentTypes.map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-emerald-50"
                >
                  <input
                    type="radio"
                    name="documentType"
                    value={type}
                    className="h-4 w-4 accent-emerald-700"
                  />
                  <span className="text-sm text-slate-700">{type}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-emerald-900">
              Documentos recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploads.map((upload) => {
              const Icon = upload.icon;
              const isVerified = upload.status === "Verificado";
              return (
                <div
                  key={upload.filename}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex-shrink-0 rounded-md bg-slate-100 p-2">
                    <Icon className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {upload.filename}
                    </p>
                    <p className="text-xs text-slate-500">
                      {upload.size} · {upload.date}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`flex items-center gap-1 text-xs ${
                      isVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {upload.status}
                  </Badge>
                  <button
                    aria-label={`Eliminar ${upload.filename}`}
                    className="flex-shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="rounded-full bg-emerald-100 p-2">
            <Shield className="h-5 w-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-900">
              Tus documentos están protegidos con encriptación AES-256
            </p>
          </div>
          <Lock className="h-5 w-5 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}
