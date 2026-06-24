"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  DollarSign,
  Percent,
  Users,
  Download,
  Eye,
  Pencil,
  Send,
  Zap,
  Target,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Printer,
  Bookmark,
  Scale,
  Gavel,
  ChevronRight,
  ChevronDown,
  Calendar,
  UserCheck,
  Lock,
  KeyRound,
  BadgeCheck,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/seed-data";

const demoAgreements = [
  {
    id: "agr-001",
    caseId: "case-001",
    debtor: "Juan Pérez",
    idNumber: "001-1234567-8",
    type: "installments",
    originalAmount: 125000,
    discountPercent: 20,
    finalAmount: 100000,
    installments: 3,
    installmentAmount: 33333,
    firstPaymentDate: "2026-06-15",
    status: "approved",
    approvedBy: "Supervisor Automático",
    approvedAt: "2026-06-09T14:35:00Z",
    generatedBy: "Lic. María Fernández",
    generatedAt: "2026-06-09T14:30:00Z",
    channel: "call",
    autoApproved: true,
    compliance: {
      withinMaxDiscount: true,
      withinMaxInstallments: true,
      withinAutoApproval: true,
      noDispute: true,
    },
    payments: [
      { date: "2026-06-15", amount: 33333, status: "pending" },
      { date: "2026-07-15", amount: 33333, status: "pending" },
      { date: "2026-08-15", amount: 33334, status: "pending" },
    ],
  },
  {
    id: "agr-002",
    caseId: "case-004",
    debtor: "Ana Rodríguez",
    idNumber: "004-2222222-4",
    type: "installments",
    originalAmount: 175000,
    discountPercent: 15,
    finalAmount: 148750,
    installments: 4,
    installmentAmount: 37188,
    firstPaymentDate: "2026-06-12",
    status: "pending_approval",
    approvedBy: null,
    approvedAt: null,
    generatedBy: "Luis Martínez",
    generatedAt: "2026-06-09T11:30:00Z",
    channel: "call",
    autoApproved: false,
    reasonManual: "Monto > RD$50,000 requiere supervisor",
    compliance: {
      withinMaxDiscount: true,
      withinMaxInstallments: true,
      withinAutoApproval: false,
      noDispute: true,
    },
    payments: [
      { date: "2026-06-12", amount: 37188, status: "pending" },
      { date: "2026-07-12", amount: 37188, status: "pending" },
      { date: "2026-08-12", amount: 37188, status: "pending" },
      { date: "2026-09-12", amount: 37186, status: "pending" },
    ],
  },
  {
    id: "agr-003",
    caseId: "case-006",
    debtor: "Laura Fernández",
    idNumber: "006-4444444-8",
    type: "installments",
    originalAmount: 320000,
    discountPercent: 25,
    finalAmount: 240000,
    installments: 6,
    installmentAmount: 40000,
    firstPaymentDate: "2026-06-01",
    status: "active",
    approvedBy: "Lic. Ana López",
    approvedAt: "2026-05-28T10:00:00Z",
    generatedBy: "Luis Martínez",
    generatedAt: "2026-05-28T09:30:00Z",
    channel: "call",
    autoApproved: false,
    reasonManual: "Descuento >30% requiere aprobación",
    compliance: {
      withinMaxDiscount: false,
      withinMaxInstallments: true,
      withinAutoApproval: false,
      noDispute: true,
    },
    payments: [
      { date: "2026-06-01", amount: 40000, status: "paid" },
      { date: "2026-07-01", amount: 40000, status: "paid" },
      { date: "2026-08-01", amount: 40000, status: "pending" },
      { date: "2026-09-01", amount: 40000, status: "pending" },
      { date: "2026-10-01", amount: 40000, status: "pending" },
      { date: "2026-11-01", amount: 40000, status: "pending" },
    ],
  },
  {
    id: "agr-004",
    caseId: "case-005",
    debtor: "Carlos Sánchez",
    idNumber: "005-3333333-6",
    type: "lump_sum",
    originalAmount: 65000,
    discountPercent: 30,
    finalAmount: 45500,
    installments: 1,
    installmentAmount: 45500,
    firstPaymentDate: "2026-06-20",
    status: "pending_approval",
    approvedBy: null,
    approvedAt: null,
    generatedBy: "Carlos Ramírez",
    generatedAt: "2026-06-09T16:30:00Z",
    channel: "sms",
    autoApproved: false,
    reasonManual: "Descuento =30% límite — revisión por supervisor",
    compliance: {
      withinMaxDiscount: true,
      withinMaxInstallments: true,
      withinAutoApproval: true,
      noDispute: true,
    },
    payments: [
      { date: "2026-06-20", amount: 45500, status: "pending" },
    ],
  },
  {
    id: "agr-005",
    caseId: "case-007",
    debtor: "Diego Morales",
    idNumber: "007-5555555-0",
    type: "installments",
    originalAmount: 145000,
    discountPercent: 10,
    finalAmount: 130500,
    installments: 3,
    installmentAmount: 43500,
    firstPaymentDate: "2026-06-18",
    status: "rejected",
    approvedBy: "Lic. Ana López",
    approvedAt: "2026-06-09T15:00:00Z",
    generatedBy: "Carlos Ramírez",
    generatedAt: "2026-06-09T10:00:00Z",
    channel: "email",
    autoApproved: false,
    reasonManual: "Deudor rechazó — solicita más descuento",
    compliance: {
      withinMaxDiscount: true,
      withinMaxInstallments: true,
      withinAutoApproval: true,
      noDispute: true,
    },
    payments: [],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  approved: { label: "Aprobado", color: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="w-3 h-3" /> },
  active: { label: "Activo", color: "bg-blue-100 text-blue-800", icon: <Zap className="w-3 h-3" /> },
  pending_approval: { label: "Pendiente", color: "bg-amber-100 text-amber-800", icon: <Clock className="w-3 h-3" /> },
  rejected: { label: "Rechazado", color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
  expired: { label: "Vencido", color: "bg-slate-100 text-slate-800", icon: <AlertTriangle className="w-3 h-3" /> },
};

export default function AgreementsPage() {
  const [selectedAgreement, setSelectedAgreement] = useState<typeof demoAgreements[0] | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgreements = demoAgreements.filter(
    (a) =>
      a.debtor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.idNumber.includes(searchQuery)
  );

  const approvedCount = demoAgreements.filter((a) => a.status === "approved" || a.status === "active").length;
  const pendingCount = demoAgreements.filter((a) => a.status === "pending_approval").length;
  const totalAgreed = demoAgreements.reduce((acc, a) => acc + a.finalAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Acuerdos y Promesas</h1>
            <p className="text-sm text-slate-500">
              Generación, aprobación y seguimiento de acuerdos de pago
            </p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowGenerateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generar Acuerdo
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Total Acuerdos</p>
                <p className="text-2xl font-bold text-slate-900">{demoAgreements.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2">{approvedCount} activos/aprobados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Pendientes</p>
                <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Esperando aprobación</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Monto Acordado</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalAgreed)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Sumatoria de acuerdos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase">Auto-Aprobados</p>
                <p className="text-2xl font-bold text-slate-900">{demoAgreements.filter(a => a.autoApproved).length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Sin intervención humana</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar acuerdo..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" /> Filtros
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" /> Exportar
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deudor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Original</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>Cuotas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Aprobación</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.map((agr) => {
                const status = statusConfig[agr.status];
                return (
                  <TableRow key={agr.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{agr.debtor}</p>
                        <p className="text-xs text-slate-400">{agr.idNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {agr.type === "installments" ? "Cuotas" : "Pago único"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{formatCurrency(agr.originalAmount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Percent className="w-3 h-3 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">{agr.discountPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{formatCurrency(agr.finalAmount)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{agr.installments}x <span className="text-slate-500">{formatCurrency(agr.installmentAmount)}</span></span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${status.color}`}>
                        <span className="flex items-center gap-1">
                          {status.icon}
                          {status.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {agr.autoApproved ? (
                        <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto
                        </Badge>
                      ) : agr.status === "pending_approval" ? (
                        <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                          <Clock className="w-3 h-3 mr-1" />
                          Manual
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500">{agr.approvedBy}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAgreement(agr)}>
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

      <Dialog open={!!selectedAgreement} onOpenChange={() => setSelectedAgreement(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAgreement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Acuerdo {selectedAgreement.id}
                </DialogTitle>
                <DialogDescription>{selectedAgreement.debtor} · {selectedAgreement.idNumber}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Monto Original</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedAgreement.originalAmount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs text-emerald-600">Monto Final ({selectedAgreement.discountPercent}% desc.)</p>
                    <p className="text-lg font-bold text-emerald-700">{formatCurrency(selectedAgreement.finalAmount)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-900">Calendario de Pagos:</p>
                  <div className="space-y-2">
                    {selectedAgreement.payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 w-6">#{i + 1}</span>
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-sm text-slate-600">{formatDate(p.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{formatCurrency(p.amount)}</span>
                          <Badge className={p.status === "paid" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                            {p.status === "paid" ? "Pagado" : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm font-bold text-slate-900 mb-2">Validación de Reglas:</p>
                  <div className="space-y-1">
                    {Object.entries(selectedAgreement.compliance).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        {val ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <span className={val ? "text-slate-600" : "text-red-600"}>
                          {key === "withinMaxDiscount" && "Dentro de descuento máximo"}
                          {key === "withinMaxInstallments" && "Dentro de cuotas máximas"}
                          {key === "withinAutoApproval" && "Dentro de monto auto-aprobación"}
                          {key === "noDispute" && "Sin disputas activas"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {selectedAgreement.reasonManual && (
                    <p className="text-xs text-amber-700 mt-2">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      {selectedAgreement.reasonManual}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  {selectedAgreement.status === "pending_approval" && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Aprobar
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showGenerateModal} onOpenChange={() => setShowGenerateModal(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Generar Nuevo Acuerdo
            </DialogTitle>
            <DialogDescription>El sistema validará automáticamente contra las reglas de la institución</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm font-bold text-slate-900 mb-2">Reglas de la Institución:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>Descuento máximo auto: 30%</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>Cuotas: 1-6</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>Auto-aprobación ≤RD$100,000</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>Supervisor {'>'}RD$50,000</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Caso</Label>
              <Input placeholder="Buscar caso por nombre o cédula..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Descuento (%)</Label>
                <Input type="number" defaultValue={20} />
              </div>
              <div className="space-y-2">
                <Label>Cuotas</Label>
                <Input type="number" defaultValue={3} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700">AI: Probabilidad de aceptación estimada: 78%. Recomendación: 3 cuotas con 20% descuento.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGenerateModal(false)}>Cancelar</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <FileText className="w-4 h-4 mr-1" />
                Generar y Validar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
