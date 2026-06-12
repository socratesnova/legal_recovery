"use client";

import { useState, useEffect } from "react";
import {
  Store,
  Tag,
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  FileText,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ShoppingCart,
  Percent,
  Receipt,
  BarChart3,
  ArrowRight,
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
import { formatCurrency } from "@/lib/seed-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const pricingHistory = [
  { month: "Jul", avgPrice: 22.0 },
  { month: "Ago", avgPrice: 23.5 },
  { month: "Sep", avgPrice: 21.8 },
  { month: "Oct", avgPrice: 25.2 },
  { month: "Nov", avgPrice: 24.0 },
  { month: "Dic", avgPrice: 26.5 },
  { month: "Ene", avgPrice: 25.8 },
  { month: "Feb", avgPrice: 27.2 },
  { month: "Mar", avgPrice: 26.0 },
  { month: "Abr", avgPrice: 28.5 },
  { month: "May", avgPrice: 29.0 },
  { month: "Jun", avgPrice: 28.5 },
];

const listings = [
  {
    id: "lst-001",
    name: "Cartera Tarjetas Q2-2026",
    type: "Tarjetas",
    cases: 450,
    faceValue: 12500000,
    askingPrice: 3750000,
    discountPct: 70,
    ageRange: "45-180 días",
    geo: [
      { city: "Santo Domingo", pct: 60 },
      { city: "Santiago", pct: 25 },
      { city: "Other", pct: 15 },
    ],
    docsComplete: 85,
    qualityScore: 82,
    status: "En venta",
    views: 8,
    interestedBuyers: 3,
    buyer: null,
    soldAt: null,
  },
  {
    id: "lst-002",
    name: "Préstamos Personales Castigados",
    type: "Préstamos",
    cases: 320,
    faceValue: 18000000,
    askingPrice: 5400000,
    discountPct: 70,
    ageRange: "60-240 días",
    geo: [
      { city: "Santo Domingo", pct: 55 },
      { city: "Santiago", pct: 30 },
      { city: "Other", pct: 15 },
    ],
    docsComplete: 78,
    qualityScore: 75,
    status: "Negociando",
    views: 12,
    interestedBuyers: 5,
    buyer: null,
    soldAt: null,
  },
  {
    id: "lst-003",
    name: "Vehículos 2025",
    type: "Vehículos",
    cases: 180,
    faceValue: 8500000,
    askingPrice: 2550000,
    discountPct: 70,
    ageRange: "90-365 días",
    geo: [
      { city: "Santo Domingo", pct: 65 },
      { city: "Santiago", pct: 20 },
      { city: "Other", pct: 15 },
    ],
    docsComplete: 92,
    qualityScore: 88,
    status: "Vendida",
    views: 18,
    interestedBuyers: 4,
    buyer: "Legal Recovery OS",
    soldAt: 2380000,
  },
];

const interestedBuyers = [
  {
    id: "buy-001",
    name: "Bufete Rodríguez & Asoc.",
    type: "Oficina Legal",
    date: "2026-06-08",
    offerAmount: 3500000,
    status: "Pendiente",
    listingId: "lst-001",
  },
  {
    id: "buy-002",
    name: "Fondo Caribe Capital",
    type: "Fondo",
    date: "2026-06-07",
    offerAmount: 5100000,
    status: "Pendiente",
    listingId: "lst-002",
  },
  {
    id: "buy-003",
    name: "LexCollect SRL",
    type: "Oficina Legal",
    date: "2026-06-05",
    offerAmount: 3200000,
    status: "Rechazado",
    listingId: "lst-001",
  },
  {
    id: "buy-004",
    name: "Legal Recovery OS",
    type: "Oficina Legal",
    date: "2026-06-03",
    offerAmount: 2380000,
    status: "Aceptado",
    listingId: "lst-003",
  },
  {
    id: "buy-005",
    name: "Fondo del Este SA",
    type: "Fondo",
    date: "2026-06-01",
    offerAmount: 4800000,
    status: "Pendiente",
    listingId: "lst-002",
  },
];

const statusStyles: Record<string, string> = {
  "En venta": "bg-emerald-100 text-emerald-800 border-emerald-200",
  Negociando: "bg-amber-100 text-amber-800 border-amber-200",
  Vendida: "bg-blue-100 text-blue-800 border-blue-200",
  Retirada: "bg-slate-100 text-slate-800 border-slate-200",
};

const buyerStatusStyles: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800 border-amber-200",
  Rechazado: "bg-red-100 text-red-800 border-red-200",
  Aceptado: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const typeBadgeStyles: Record<string, string> = {
  Tarjetas: "bg-violet-100 text-violet-800 border-violet-200",
  Préstamos: "bg-sky-100 text-sky-800 border-sky-200",
  Vehículos: "bg-orange-100 text-orange-800 border-orange-200",
  Hipotecas: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function BankMarketplacePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const activeCount = listings.filter(
    (l) => l.status === "En venta" || l.status === "Negociando"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-600" />
            Marketplace de Carteras
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publica y gestiona la venta de tus carteras castigadas
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-indigo-50 text-indigo-700 border-indigo-200 self-start sm:self-auto text-sm px-3 py-1"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          {activeCount} carteras activas
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Carteras publicadas
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">12</span> carteras
              vendidas (histórico)
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Monto total ofrecido
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(62500000)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Vendido:{" "}
              <span className="font-medium text-slate-700">
                {formatCurrency(48200000)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Precio promedio venta
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  28.5%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Percent className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Del valor nominal promedio
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Comisión plataforma
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">2.5%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Sobre monto de transacción
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Listados Activos
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">
                      {listing.name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={typeBadgeStyles[listing.type] ?? ""}
                      >
                        {listing.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={statusStyles[listing.status] ?? ""}
                      >
                        {listing.status}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <p className="text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      Casos
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {listing.cases.toLocaleString("es-DO")}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <p className="text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      Valor nominal
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(listing.faceValue)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <p className="text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      Oferta
                    </p>
                    <p className="text-lg font-bold text-indigo-700">
                      {formatCurrency(listing.askingPrice)}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <p className="text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      Descuento
                    </p>
                    <p className="text-lg font-bold text-rose-600">
                      -{listing.discountPct}%
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Edad:</span>{" "}
                  <span>{listing.ageRange} vencido</span>
                </div>

                {/* Geography */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Distribución geográfica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {listing.geo.map((g) => (
                      <div
                        key={g.city}
                        className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100"
                      >
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${g.pct}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    {listing.geo.map((g) => (
                      <span key={g.city} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {g.city} {g.pct}%
                      </span>
                    ))}
                  </div>
                </div>

                {/* Docs + Quality */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Documentación
                    </span>
                    <span className="font-medium text-slate-800">
                      {listing.docsComplete}%
                    </span>
                  </div>
                  <Progress value={listing.docsComplete} className="h-1.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      Calidad de datos
                    </span>
                    <span className="font-medium text-slate-800">
                      {listing.qualityScore}/100
                    </span>
                  </div>
                  <Progress value={listing.qualityScore} className="h-1.5" />
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {listing.views} vistas
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {listing.interestedBuyers} interesados
                  </span>
                </div>

                {/* Sold info */}
                {listing.status === "Vendida" && listing.buyer && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm">
                    <div className="flex items-center gap-2 text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Vendida a {listing.buyer}
                    </div>
                    <p className="text-emerald-700 mt-1">
                      Precio final:{" "}
                      <span className="font-bold">
                        {listing.soldAt ? formatCurrency(listing.soldAt) : "—"}
                      </span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {listing.status !== "Vendida" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-indigo-700 hover:bg-indigo-800 text-white flex-1 text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        Retirar
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 text-xs"
                      >
                        Ver ofertas
                      </Button>
                    </>
                  )}
                  {listing.status === "Vendida" && (
                    <Button
                      size="sm"
                      className="bg-indigo-700 hover:bg-indigo-800 text-white w-full text-xs"
                    >
                      Ver contrato
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Listing CTA */}
      <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-none">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva Cartera en Venta
            </h3>
            <p className="text-sm text-indigo-200 mt-1">
              Publica una nueva cartera castigada para la venta en el marketplace.
            </p>
          </div>
          <Button disabled className="bg-indigo-700 text-white opacity-60 shadow-lg">
            Próximamente
          </Button>
        </CardContent>
      </Card>

      {/* Charts + Side sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pricing History */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Historial de Precios de Venta
            </CardTitle>
            <CardDescription>
              Precio promedio de venta como % del valor nominal (últimos 12
              meses)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pricingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    domain={[15, 35]}
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "% Valor Nominal"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#6366f1",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                    name="% Valor Nominal"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales Contract Template */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Contrato Tipo
            </CardTitle>
            <CardDescription>
              Cesión de cartera — términos clave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Cesión sin recurso
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    El comprador adquiere los derechos de cobro sin obligación de
                    devolver la cartera.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Precio y comisión
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Precio acordado menos comisión de plataforma (2.5%). Pago a 5
                    días hábiles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Representaciones y garantías
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    El vendedor declara legitimidad de la deuda y entrega de
                    documentación respaldatoria.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Transferencia de datos
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Solo datos con base legal válida se transfieren bajo acuerdo de
                    confidencialidad.
                  </p>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-indigo-700 hover:bg-indigo-800 text-white w-full mt-4 text-xs"
            >
              Descargar contrato tipo <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interested Buyers Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Compradores Interesados
            </CardTitle>
          </div>
          <CardDescription>
            Ofertas recibidas y expresiones de interés por cartera
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cartera</TableHead>
                  <TableHead>Oferta</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interestedBuyers.map((buyer) => (
                  <TableRow key={buyer.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-indigo-700">
                            {buyer.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900 text-sm">
                          {buyer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-100 text-slate-700 border-slate-200 text-xs"
                      >
                        {buyer.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(buyer.date).toLocaleDateString("es-DO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {
                        listings.find((l) => l.id === buyer.listingId)?.name ??
                        buyer.listingId
                      }
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 text-sm">
                      {formatCurrency(buyer.offerAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          buyerStatusStyles[buyer.status] ??
                          "bg-slate-100 text-slate-800 border-slate-200"
                        }
                      >
                        {buyer.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
