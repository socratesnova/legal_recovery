"use client";

import * as React from "react";
import {
  ShoppingCart,
  Store,
  TrendingUp,
  DollarSign,
  Building2,
  Package,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ArrowRight,
  GitCompare,
  BarChart3,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/seed-data";

/* ────────────────────────────
   Types
   ──────────────────────────── */
interface GeoSegment {
  label: string;
  value: number;
  color: string;
}

interface Listing {
  id: string;
  bank: string;
  bankShort: string;
  name: string;
  type: string;
  cases: number;
  faceValue: number;
  askingPrice: number;
  recoveryRate: number; // 0–1
  estRecovery: number;
  roi: number; // %
  docs: number; // 0–100
  quality: number; // 0–100
  daysOverdueMin: number;
  daysOverdueMax: number;
  geo: GeoSegment[];
}

interface Purchase {
  id: string;
  name: string;
  bank: string;
  purchasePrice: number;
  faceValue: number;
  currentRecovery: number;
  roi: number;
  status: "Activa" | "Cerrada";
}

/* ────────────────────────────
   Data
   ──────────────────────────── */
const listings: Listing[] = [
  {
    id: "lst-001",
    bank: "Banco Popular Dominicano",
    bankShort: "BPD",
    name: "Cartera Tarjetas Q2-2026",
    type: "Tarjetas de Crédito",
    cases: 450,
    faceValue: 12_500_000,
    askingPrice: 3_750_000,
    recoveryRate: 0.65,
    estRecovery: 8_125_000,
    roi: 116,
    docs: 85,
    quality: 82,
    daysOverdueMin: 90,
    daysOverdueMax: 540,
    geo: [
      { label: "SD", value: 60, color: "bg-emerald-600" },
      { label: "STI", value: 25, color: "bg-emerald-400" },
      { label: "Otr", value: 15, color: "bg-slate-400" },
    ],
  },
  {
    id: "lst-002",
    bank: "BHD León",
    bankShort: "BHD",
    name: "Préstamos Personales Castigados",
    type: "Préstamos Personales",
    cases: 320,
    faceValue: 18_000_000,
    askingPrice: 5_400_000,
    recoveryRate: 0.55,
    estRecovery: 9_900_000,
    roi: 83,
    docs: 78,
    quality: 75,
    daysOverdueMin: 120,
    daysOverdueMax: 720,
    geo: [
      { label: "SD", value: 55, color: "bg-emerald-600" },
      { label: "STI", value: 30, color: "bg-emerald-400" },
      { label: "Otr", value: 15, color: "bg-slate-400" },
    ],
  },
  {
    id: "lst-003",
    bank: "Banco López de Haro",
    bankShort: "BL",
    name: "Hipotecas Judicializadas",
    type: "Hipotecas",
    cases: 85,
    faceValue: 28_000_000,
    askingPrice: 8_400_000,
    recoveryRate: 0.45,
    estRecovery: 12_600_000,
    roi: 50,
    docs: 95,
    quality: 91,
    daysOverdueMin: 360,
    daysOverdueMax: 1460,
    geo: [
      { label: "SD", value: 50, color: "bg-emerald-600" },
      { label: "STI", value: 20, color: "bg-emerald-400" },
      { label: "Otr", value: 30, color: "bg-slate-400" },
    ],
  },
];

const purchases: Purchase[] = [
  {
    id: "pur-001",
    name: "Cartera Consumo Q4-2025",
    bank: "BPD",
    purchasePrice: 4_200_000,
    faceValue: 14_000_000,
    currentRecovery: 9_100_000,
    roi: 116,
    status: "Activa",
  },
  {
    id: "pur-002",
    name: "Tarjetas Castigadas Feb-2026",
    bank: "BHD",
    purchasePrice: 2_800_000,
    faceValue: 9_300_000,
    currentRecovery: 5_580_000,
    roi: 99,
    status: "Activa",
  },
  {
    id: "pur-003",
    name: "Préstamos Auto 2025",
    bank: "BL",
    purchasePrice: 6_000_000,
    faceValue: 20_000_000,
    currentRecovery: 10_000_000,
    roi: 66,
    status: "Activa",
  },
  {
    id: "pur-004",
    name: "Microcréditos Q1-2025",
    bank: "BPD",
    purchasePrice: 1_500_000,
    faceValue: 5_000_000,
    currentRecovery: 3_750_000,
    roi: 150,
    status: "Cerrada",
  },
  {
    id: "pur-005",
    name: "Hipotecas Subprime",
    bank: "BHD",
    purchasePrice: 12_000_000,
    faceValue: 40_000_000,
    currentRecovery: 8_400_000,
    roi: 30,
    status: "Activa",
  },
];

const marketTrends = [
  { month: "Ene", listed: 2, avgDiscountOffered: 32, avgDiscountSold: 28 },
  { month: "Feb", listed: 3, avgDiscountOffered: 30, avgDiscountSold: 27 },
  { month: "Mar", listed: 4, avgDiscountOffered: 31, avgDiscountSold: 29 },
  { month: "Abr", listed: 2, avgDiscountOffered: 29, avgDiscountSold: 26 },
  { month: "May", listed: 5, avgDiscountOffered: 28, avgDiscountSold: 25 },
  { month: "Jun", listed: 3, avgDiscountOffered: 30, avgDiscountSold: 27 },
];

/* ────────────────────────────
   Helpers
   ──────────────────────────── */
function pctOfFace(listing: Listing) {
  return Math.round((listing.askingPrice / listing.faceValue) * 100);
}

function qualityColor(score: number) {
  if (score >= 85) return "text-emerald-700";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
}

function qualityBg(score: number) {
  if (score >= 85) return "bg-emerald-100";
  if (score >= 70) return "bg-amber-100";
  return "bg-red-100";
}

/* ────────────────────────────
   Components
   ──────────────────────────── */
export default function AdminMarketplacePage() {
  const [compareIds, setCompareIds] = React.useState<string[]>([]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  const compared = listings.filter((l) => compareIds.includes(l.id));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <section className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Marketplace de Carteras
              </h1>
              <p className="text-sm text-slate-500">
                Compra carteras castigadas de bancos y fondos
              </p>
            </div>
            <Badge className="w-fit bg-emerald-100 text-emerald-800">
              3 ofertas activas
            </Badge>
          </div>
        </section>

        {/* ── Stats Row ── */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Carteras compradas
              </CardTitle>
              <ShoppingCart className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">8</div>
              <p className="text-xs text-slate-500">Histórico</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Monto invertido
              </CardTitle>
              <DollarSign className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(28_500_000)}
              </div>
              <p className="text-xs text-slate-500">Total acumulado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Recuperación esperada
              </CardTitle>
              <TrendingUp className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(45_200_000)}
              </div>
              <p className="text-xs text-slate-500">158% ROI</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Carteras disponibles
              </CardTitle>
              <Store className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">3</div>
              <p className="text-xs text-slate-500">En oferta hoy</p>
            </CardContent>
          </Card>
        </section>

        {/* ── Available Portfolios ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-emerald-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Carteras Disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <Card key={l.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-slate-100">
                      <Landmark className="size-4 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">
                        {l.bankShort} — {l.name}
                      </CardTitle>
                      <CardDescription>{l.bank}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{l.type}</Badge>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="mr-1 size-3" />
                      Documentación verificada
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key numbers */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Casos</p>
                      <p className="font-semibold text-slate-900">
                        {l.cases.toLocaleString("es-DO")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Valor nominal</p>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(l.faceValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Precio solicitado</p>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(l.askingPrice)} ({pctOfFace(l)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Recuperación estimada</p>
                      <p className="font-semibold text-emerald-700">
                        {formatCurrency(l.estRecovery)}
                      </p>
                    </div>
                  </div>

                  {/* ROI */}
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-800">
                      TU ROI ESTIMADO
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {l.roi}%
                    </p>
                    <p className="text-xs text-emerald-700/80">
                      Tasa de recuperación {Math.round(l.recoveryRate * 100)}%
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Días vencidos
                      </span>
                      <span className="font-medium text-slate-900">
                        {l.daysOverdueMin} – {l.daysOverdueMax}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Documentación
                      </span>
                      <span className="font-medium text-slate-900">
                        {l.docs}%
                      </span>
                    </div>
                    <Progress value={l.docs}>
                      <ProgressTrack>
                        <ProgressIndicator />
                      </ProgressTrack>
                    </Progress>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Calidad de datos
                      </span>
                      <span
                        className={`font-medium ${qualityColor(
                          l.quality
                        )}`}
                      >
                        {l.quality}/100
                      </span>
                    </div>
                    <Progress value={l.quality}>
                      <ProgressTrack>
                        <ProgressIndicator />
                      </ProgressTrack>
                    </Progress>
                  </div>

                  {/* Geo heatmap bar */}
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-600">
                      Distribución geográfica
                    </p>
                    <div className="flex h-4 w-full overflow-hidden rounded-md">
                      {l.geo.map((g) => (
                        <div
                          key={g.label}
                          className={`${g.color} flex items-center justify-center text-[10px] font-medium text-white`}
                          style={{ width: `${g.value}%` }}
                        >
                          {g.value >= 12 ? g.label : ""}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 flex gap-3 text-[10px] text-slate-500">
                      {l.geo.map((g) => (
                        <span key={g.label} className="inline-flex items-center gap-1">
                          <span className={`inline-block size-2 rounded-full ${g.color}`} />
                          {g.label} {g.value}%
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto flex flex-wrap gap-2 border-t bg-slate-50/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="mr-1 size-4" />
                    Ver Detalle
                  </Button>

                  <Dialog>
                    <DialogTrigger>
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800"
                      >
                        Hacer Oferta
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Hacer Oferta</DialogTitle>
                        <DialogDescription>
                          {l.bankShort} — {l.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-1">
                          <Label htmlFor={`offer-${l.id}`}>Tu oferta (RD$)</Label>
                          <Input
                            id={`offer-${l.id}`}
                            type="number"
                            defaultValue={l.askingPrice}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`msg-${l.id}`}>Mensaje al vendedor</Label>
                          <textarea
                            id={`msg-${l.id}`}
                            rows={3}
                            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            placeholder="Condiciones especiales, solicitud de due diligence adicional..."
                          />
                        </div>
                        <div className="flex items-start gap-2">
                          <input
                            id={`terms-${l.id}`}
                            type="checkbox"
                            className="mt-1 size-4 accent-emerald-700"
                          />
                          <Label
                            htmlFor={`terms-${l.id}`}
                            className="text-xs font-normal leading-relaxed text-slate-600"
                          >
                            Acepto los términos del marketplace y confirmo que cuento con la capacidad financiera para ejecutar la compra.
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          className="bg-emerald-700 text-white hover:bg-emerald-800"
                          disabled
                          onClick={() =>
                            toast.info("Demo: Oferta registrada", {
                              description: `Oferta enviada a ${l.bankShort}`,
                            })
                          }
                        >
                          Enviar Oferta
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={
                      compareIds.includes(l.id)
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-500"
                    }
                    onClick={() => toggleCompare(l.id)}
                    title="Comparar"
                  >
                    <GitCompare className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Portfolio Comparison ── */}
        {compared.length === 2 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <GitCompare className="size-5 text-emerald-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Comparación de Carteras
              </h2>
              <Button
                variant="ghost"
                size="xs"
                className="ml-auto text-slate-500"
                onClick={() => setCompareIds([])}
              >
                Limpiar
              </Button>
            </div>
            <Card>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[10rem]">Métrica</TableHead>
                      {compared.map((c) => (
                        <TableHead key={c.id}>{c.bankShort} — {c.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Casos", get: (x: Listing) => x.cases.toLocaleString("es-DO") },
                      { label: "Valor nominal", get: (x: Listing) => formatCurrency(x.faceValue) },
                      { label: "Precio solicitado", get: (x: Listing) => formatCurrency(x.askingPrice) },
                      { label: "% de valor", get: (x: Listing) => `${pctOfFace(x)}%` },
                      { label: "Recuperación estimada", get: (x: Listing) => formatCurrency(x.estRecovery) },
                      { label: "ROI estimado", get: (x: Listing) => `${x.roi}%` },
                      { label: "Calidad de datos", get: (x: Listing) => `${x.quality}/100` },
                      { label: "Documentación", get: (x: Listing) => `${x.docs}%` },
                    ].map((row) => (
                      <TableRow key={row.label}>
                        <TableCell className="font-medium text-slate-700">
                          {row.label}
                        </TableCell>
                        {compared.map((c) => (
                          <TableCell key={c.id}>{row.get(c)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── My Purchases ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-emerald-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Mis Compras
            </h2>
          </div>
          <Card>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cartera</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Precio de compra</TableHead>
                    <TableHead>Valor nominal</TableHead>
                    <TableHead>Recuperación actual</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-slate-900">
                        {p.name}
                      </TableCell>
                      <TableCell>{p.bank}</TableCell>
                      <TableCell>{formatCurrency(p.purchasePrice)}</TableCell>
                      <TableCell>{formatCurrency(p.faceValue)}</TableCell>
                      <TableCell>{formatCurrency(p.currentRecovery)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            p.roi >= 100
                              ? "text-emerald-700"
                              : p.roi >= 50
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {p.roi >= 50 ? (
                            <TrendingUp className="size-3.5" />
                          ) : (
                            <AlertTriangle className="size-3.5" />
                          )}
                          {p.roi}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.status === "Activa" ? "default" : "secondary"}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* ── Market Trends ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-emerald-700" />
            <h2 className="text-lg font-semibold text-slate-900">
              Tendencias del Mercado
            </h2>
          </div>
          <Card>
            <CardContent className="pt-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketTrends} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis
                      yAxisId="left"
                      tickLine={false}
                      axisLine={false}
                      label={{
                        value: "Carteras listadas",
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                        style: { fill: "#64748b", fontSize: 12 },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      label={{
                        value: "Descuento promedio (%)",
                        angle: 90,
                        position: "insideRight",
                        offset: 10,
                        style: { fill: "#64748b", fontSize: 12 },
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="listed"
                      name="Carteras listadas"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="avgDiscountOffered"
                      name="Descuerto ofrecido"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="avgDiscountSold"
                      name="Descuerto vendido"
                      fill="#334155"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Footer spacer ── */}
        <div className="h-8" />
      </div>
    </div>
  );
}
