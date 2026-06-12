"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Brain,
  FolderOpen,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Zap,
  BarChart3,
  Download,
  Eye,
  Ban,
  Search,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Lock,
  KeyRound,
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
import { Progress } from "@/components/ui/progress";
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
import { formatCurrency, formatDate } from "@/lib/seed-data";
import Link from "next/link";

const demoPortfolios = [
  {
    id: "port-001",
    name: "Cartera Tarjetas BPD Jun 2026",
    institution: "Banco Popular Dominicano",
    type: "Tarjetas de crédito",
    totalCases: 1200,
    totalAmount: 50000000,
    recovered: 8500000,
    netRecovery: 6200000,
    cost: 2300000,
    agreements: 45,
    disputes: 3,
    currency: "DOP",
    uploadDate: "2026-06-01",
    status: "active",
    validation: {
      total: 1200,
      valid: 1185,
      duplicates: 8,
      errors: 7,
      progress: 100,
    },
    documents: {
      contrato: 98,
      cesion: 95,
      pagare: 100,
      estadoCuenta: 92,
    },
    scores: {
      documental: 96,
      contactabilidad: 75,
      recoverability: 68,
      risk: 45,
    },
    ageDays: 10,
    sourceFormat: "CSV BPD v3.2",
    aiInsights: "Alta concentración de casos 30-60 días. Recomendar acuerdos de 3 cuotas con 20% descuento.",
  },
  {
    id: "port-002",
    name: "Cartera Préstamos BHD Jun 2026",
    institution: "Banco BHD",
    type: "Préstamos personales",
    totalCases: 850,
    totalAmount: 35000000,
    recovered: 4200000,
    netRecovery: 3100000,
    cost: 1100000,
    agreements: 28,
    disputes: 7,
    currency: "DOP",
    uploadDate: "2026-06-05",
    status: "processing",
    validation: {
      total: 850,
      valid: 800,
      duplicates: 15,
      errors: 35,
      progress: 85,
    },
    documents: {
      contrato: 85,
      cesion: 70,
      pagare: 90,
      estadoCuenta: 80,
    },
    scores: {
      documental: 81,
      contactabilidad: 60,
      recoverability: 55,
      risk: 60,
    },
    ageDays: 6,
    sourceFormat: "Excel BHD (.xlsx)",
    aiInsights: "35 errores de formato detectados. 15 duplicados por cédula+producto. Validación en progreso.",
  },
  {
    id: "port-003",
    name: "Cartera Hipotecas Banco León May 2026",
    institution: "Banco León",
    type: "Hipotecas",
    totalCases: 320,
    totalAmount: 150000000,
    recovered: 12500000,
    netRecovery: 9800000,
    cost: 2700000,
    agreements: 12,
    disputes: 1,
    currency: "DOP",
    uploadDate: "2026-05-15",
    status: "active",
    validation: {
      total: 320,
      valid: 318,
      duplicates: 2,
      errors: 0,
      progress: 100,
    },
    documents: {
      contrato: 100,
      cesion: 100,
      pagare: 100,
      estadoCuenta: 99,
    },
    scores: {
      documental: 99,
      contactabilidad: 85,
      recoverability: 80,
      risk: 30,
    },
    ageDays: 27,
    sourceFormat: "XML Banco León",
    aiInsights: "Documentación casi perfecta. 2 duplicados menores. Recuperabilidad alta por monto.",
  },
  {
    id: "port-004",
    name: "Cartera Comercial Scotia Q2 2026",
    institution: "Scotiabank",
    type: "Préstamos comerciales",
    totalCases: 450,
    totalAmount: 78000000,
    recovered: 5800000,
    netRecovery: 3900000,
    cost: 1900000,
    agreements: 18,
    disputes: 9,
    currency: "DOP",
    uploadDate: "2026-05-28",
    status: "pending_review",
    validation: {
      total: 450,
      valid: 380,
      duplicates: 45,
      errors: 25,
      progress: 65,
    },
    documents: {
      contrato: 70,
      cesion: 60,
      pagare: 75,
      estadoCuenta: 65,
    },
    scores: {
      documental: 68,
      contactabilidad: 50,
      recoverability: 45,
      risk: 75,
    },
    ageDays: 14,
    sourceFormat: "CSV Scotia (formato legado)",
    aiInsights: "45 duplicados detectados. Formato legado requiere mapeo manual. Revisión obligatoria.",
  },
  {
    id: "port-005",
    name: "Cartera Vehículos BHD May 2026",
    institution: "Banco BHD",
    type: "Préstamos vehículos",
    totalCases: 580,
    totalAmount: 42000000,
    recovered: 3800000,
    netRecovery: 2900000,
    cost: 900000,
    agreements: 22,
    disputes: 4,
    currency: "DOP",
    uploadDate: "2026-05-20",
    status: "active",
    validation: {
      total: 580,
      valid: 575,
      duplicates: 3,
      errors: 2,
      progress: 100,
    },
    documents: {
      contrato: 95,
      cesion: 92,
      pagare: 98,
      estadoCuenta: 88,
    },
    scores: {
      documental: 93,
      contactabilidad: 72,
      recoverability: 65,
      risk: 50,
    },
    ageDays: 22,
    sourceFormat: "CSV BHD v2.1",
    aiInsights: "Buena documentación. Riesgo moderado. Recomendar acuerdos de 4 cuotas con 15% descuento.",
  },
  {
    id: "port-006",
    name: "Cartera Microcréditos FEDA Jun 2026",
    institution: "FEDA (Fondo de Desarrollo Agropecuario)",
    type: "Microcréditos",
    totalCases: 2100,
    totalAmount: 28000000,
    recovered: 2100000,
    netRecovery: 1500000,
    cost: 600000,
    agreements: 35,
    disputes: 2,
    currency: "DOP",
    uploadDate: "2026-06-08",
    status: "processing",
    validation: {
      total: 2100,
      valid: 2050,
      duplicates: 30,
      errors: 20,
      progress: 92,
    },
    documents: {
      contrato: 88,
      cesion: 82,
      pagare: 90,
      estadoCuenta: 85,
    },
    scores: {
      documental: 86,
      contactabilidad: 55,
      recoverability: 40,
      risk: 65,
    },
    ageDays: 3,
    sourceFormat: "Excel FEDA",
    aiInsights: "Alto volumen, montos pequeños. Contactabilidad baja rural. Canal preferido: portal + SMS.",
  },
  {
    id: "port-007",
    name: "Cartera Tarjetas Banreservas Q1 2026",
    institution: "Banreservas",
    type: "Tarjetas de crédito",
    totalCases: 950,
    totalAmount: 38000000,
    recovered: 15200000,
    netRecovery: 11800000,
    cost: 3400000,
    agreements: 78,
    disputes: 5,
    currency: "DOP",
    uploadDate: "2026-03-15",
    status: "completed",
    validation: {
      total: 950,
      valid: 940,
      duplicates: 5,
      errors: 5,
      progress: 100,
    },
    documents: {
      contrato: 97,
      cesion: 94,
      pagare: 99,
      estadoCuenta: 91,
    },
    scores: {
      documental: 95,
      contactabilidad: 70,
      recoverability: 72,
      risk: 40,
    },
    ageDays: 88,
    sourceFormat: "CSV Banreservas",
    aiInsights: "Cartera cerrada. 40% recuperado. 78 acuerdos generados. Alto rendimiento.",
  },
  {
    id: "port-008",
    name: "Cartera Hipotecas BPD Abr 2026",
    institution: "Banco Popular Dominicano",
    type: "Hipotecas",
    totalCases: 180,
    totalAmount: 95000000,
    recovered: 8500000,
    netRecovery: 6200000,
    cost: 2300000,
    agreements: 8,
    disputes: 0,
    currency: "DOP",
    uploadDate: "2026-04-10",
    status: "active",
    validation: {
      total: 180,
      valid: 178,
      duplicates: 1,
      errors: 1,
      progress: 100,
    },
    documents: {
      contrato: 99,
      cesion: 98,
      pagare: 100,
      estadoCuenta: 96,
    },
    scores: {
      documental: 98,
      contactabilidad: 80,
      recoverability: 75,
      risk: 35,
    },
    ageDays: 62,
    sourceFormat: "XML BPD Hipotecas",
    aiInsights: "Documentación excelente. Montos altos requieren gestión personalizada. 0 disputas.",
  },
  {
    id: "port-009",
    name: "Cartera Comercial Banco Santa Cruz Q2 2026",
    institution: "Banco Santa Cruz",
    type: "Préstamos comerciales",
    totalCases: 320,
    totalAmount: 55000000,
    recovered: 4100000,
    netRecovery: 2800000,
    cost: 1300000,
    agreements: 14,
    disputes: 6,
    currency: "DOP",
    uploadDate: "2026-05-25",
    status: "active",
    validation: {
      total: 320,
      valid: 305,
      duplicates: 8,
      errors: 7,
      progress: 95,
    },
    documents: {
      contrato: 90,
      cesion: 85,
      pagare: 92,
      estadoCuenta: 87,
    },
    scores: {
      documental: 88,
      contactabilidad: 65,
      recoverability: 58,
      risk: 55,
    },
    ageDays: 17,
    sourceFormat: "CSV Santa Cruz",
    aiInsights: "Riesgo moderado. 6 disputas activas requieren atención legal. Gestión cautelosa.",
  },
  {
    id: "port-010",
    name: "Cartera Préstamos Empleados BPD May 2026",
    institution: "Banco Popular Dominicano",
    type: "Préstamos personales",
    totalCases: 670,
    totalAmount: 22000000,
    recovered: 3100000,
    netRecovery: 2400000,
    cost: 700000,
    agreements: 32,
    disputes: 1,
    currency: "DOP",
    uploadDate: "2026-05-10",
    status: "active",
    validation: {
      total: 670,
      valid: 665,
      duplicates: 3,
      errors: 2,
      progress: 100,
    },
    documents: {
      contrato: 96,
      cesion: 93,
      pagare: 97,
      estadoCuenta: 90,
    },
    scores: {
      documental: 94,
      contactabilidad: 78,
      recoverability: 70,
      risk: 42,
    },
    ageDays: 32,
    sourceFormat: "CSV BPD Empleados",
    aiInsights: "Perfil empleados = alta contactabilidad. 1 disputa menor. Recomendar acuerdos cortos.",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "Activa", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  processing: { label: "Procesando", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Zap className="w-3 h-3" /> },
  pending_review: { label: "Revisión", color: "bg-amber-100 text-amber-800 border-amber-200", icon: <AlertTriangle className="w-3 h-3" /> },
  completed: { label: "Cerrada", color: "bg-slate-100 text-slate-800 border-slate-200", icon: <Lock className="w-3 h-3" /> },
};

export default function PortfoliosPage() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<typeof demoPortfolios[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPortfolios = demoPortfolios.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCases = demoPortfolios.reduce((acc, p) => acc + p.totalCases, 0);
  const totalAmount = demoPortfolios.reduce((acc, p) => acc + p.totalAmount, 0);
  const activeCount = demoPortfolios.filter((p) => p.status === "active").length;
  const avgDocumental = Math.round(
    demoPortfolios.reduce((acc, p) => acc + p.scores.documental, 0) / demoPortfolios.length
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Carteras y Portafolios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de carteras cedidas: carga, validación, deduplicación y scoring
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setShowUploadModal(true); setUploadStep(0); }}>
          <Upload className="w-4 h-4 mr-2" />
          Cargar Cartera
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Total Carteras</p>
                <p className="text-2xl font-bold text-slate-900">{demoPortfolios.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">{activeCount} activas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Casos Totales</p>
                <p className="text-2xl font-bold text-slate-900">{totalCases.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">{formatCurrency(totalAmount)} asignado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Validación Prom.</p>
                <p className="text-2xl font-bold text-slate-900">{avgDocumental}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={avgDocumental} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Deduplicación</p>
                <p className="text-2xl font-bold text-slate-900">70</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Casos duplicados detectados</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar cartera por nombre o institución..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" />
          Filtros
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-slate-600" />
            Carteras Cargadas
          </CardTitle>
          <CardDescription>Validación automática, deduplicación y scoring por cartera</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cartera</TableHead>
                <TableHead>Institución</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Casos</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Validación</TableHead>
                <TableHead>Score Doc.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPortfolios.map((p) => {
                const status = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-400">Cargada: {formatDate(p.uploadDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{p.institution}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{p.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{p.totalCases.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-slate-900">{formatCurrency(p.totalAmount)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{p.validation.progress}% validado</span>
                          <span className="text-emerald-600">{p.validation.valid}/{p.validation.total}</span>
                        </div>
                        <Progress value={p.validation.progress} className="h-1.5" />
                        <div className="flex items-center gap-2 text-[10px]">
                          {p.validation.duplicates > 0 && (
                            <span className="text-amber-600">{p.validation.duplicates} duplicados</span>
                          )}
                          {p.validation.errors > 0 && (
                            <span className="text-red-600">{p.validation.errors} errores</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-50 text-emerald-700">
                          {p.scores.documental}
                        </div>
                        <Progress value={p.scores.documental} className="w-16 h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} text-xs`}>
                        <span className="flex items-center gap-1">
                          {status.icon}
                          {status.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedPortfolio(p)}>
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

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              Cargar Nueva Cartera
            </DialogTitle>
            <DialogDescription>
              Sube un archivo CSV o Excel. El sistema validará estructura, tipos de datos y deduplicará automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {["Seleccionar archivo", "Mapear columnas", "Validar y crear"].map((step, i) => (
                <div key={i} className={`text-center p-2 rounded-lg text-xs font-medium ${
                  i === uploadStep ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                  i < uploadStep ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                }`}>
                  {step}
                </div>
              ))}
            </div>

            {uploadStep === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">Arrastra o haz click para seleccionar archivo</p>
                <p className="text-xs text-slate-400 mt-1">CSV, Excel (.xlsx) o .zip con múltiples archivos</p>
                <div className="flex items-center gap-2 justify-center mt-3">
                  <Badge variant="outline" className="text-[10px]">Máx. 50MB</Badge>
                  <Badge variant="outline" className="text-[10px]">Encriptado AES-256</Badge>
                </div>
              </div>
            )}

            {uploadStep === 1 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">Mapeo de columnas detectado:</p>
                {[
                  { col: "cedula", mapped: "idNumber", status: "ok" },
                  { col: "nombre_completo", mapped: "debtor.name", status: "ok" },
                  { col: "telefono", mapped: "phone", status: "ok" },
                  { col: "email", mapped: "email", status: "ok" },
                  { col: "monto", mapped: "balance", status: "ok" },
                  { col: "producto", mapped: "product", status: "ok" },
                  { col: "fecha_carga", mapped: "uploadDate", status: "warning" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      {m.status === "ok" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      <span className="text-sm text-slate-700">{m.col}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <Badge variant="outline" className="text-xs">{m.mapped}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {uploadStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Validación completada</p>
                      <p className="text-xs text-emerald-700">1,200 registros procesados en 45 segundos</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded bg-white">
                      <p className="text-lg font-bold text-emerald-600">1,185</p>
                      <p className="text-[10px] text-slate-500">Válidos</p>
                    </div>
                    <div className="text-center p-2 rounded bg-white">
                      <p className="text-lg font-bold text-amber-600">8</p>
                      <p className="text-[10px] text-slate-500">Duplicados</p>
                    </div>
                    <div className="text-center p-2 rounded bg-white">
                      <p className="text-lg font-bold text-red-600">7</p>
                      <p className="text-[10px] text-slate-500">Errores</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">AI: Se detectaron 8 duplicados por cédula + producto. Recomendación: merge conservando historial.</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancelar
              </Button>
              {uploadStep < 2 ? (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setUploadStep(uploadStep + 1)}>
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setShowUploadModal(false); setUploadStep(0); }}>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Crear Cartera
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Portfolio Detail Modal */}
      <Dialog open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPortfolio && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                  {selectedPortfolio.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedPortfolio.institution} · {selectedPortfolio.type} · Cargada: {formatDate(selectedPortfolio.uploadDate)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500 uppercase">Total Asignado</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(selectedPortfolio.totalAmount)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500 uppercase">Casos</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedPortfolio.totalCases.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Progreso de Validación</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Válidos</span>
                      <span className="font-medium text-emerald-700">{selectedPortfolio.validation.valid} / {selectedPortfolio.validation.total}</span>
                    </div>
                    <Progress value={(selectedPortfolio.validation.valid / selectedPortfolio.validation.total) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Duplicados</span>
                      <span className="font-medium text-amber-700">{selectedPortfolio.validation.duplicates} / {selectedPortfolio.validation.total}</span>
                    </div>
                    <Progress value={(selectedPortfolio.validation.duplicates / selectedPortfolio.validation.total) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Errores</span>
                      <span className="font-medium text-red-700">{selectedPortfolio.validation.errors} / {selectedPortfolio.validation.total}</span>
                    </div>
                    <Progress value={(selectedPortfolio.validation.errors / selectedPortfolio.validation.total) * 100} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Completitud Documental</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedPortfolio.documents).map(([doc, pct]) => (
                      <div key={doc} className="p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-700 capitalize">{doc === "estadoCuenta" ? "Estado de cuenta" : doc}</span>
                          <span className="text-xs font-bold text-slate-900">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Scores Promedio</p>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(selectedPortfolio.scores).map(([score, val]) => (
                      <div key={score} className="text-center p-3 rounded-lg bg-slate-50">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                          val >= 70 ? "bg-emerald-50 text-emerald-700" : val >= 40 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                        }`}>
                          {val}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 capitalize">{score === "documental" ? "Doc." : score === "recoverability" ? "Recup." : score === "contactability" ? "Contact." : "Riesgo"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedPortfolio(null)}>
                    Cerrar
                  </Button>
                  <Link href="/portal/admin/cases">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Expedientes
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}