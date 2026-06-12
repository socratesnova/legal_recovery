"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calculator,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Landmark,
  BarChart3,
  CircleDollarSign,
  Banknote,
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
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/seed-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthlyData = [
  { month: "Ene", ingresos: 6200000, gastos: 1400000 },
  { month: "Feb", ingresos: 7100000, gastos: 1550000 },
  { month: "Mar", ingresos: 7800000, gastos: 1600000 },
  { month: "Abr", ingresos: 6900000, gastos: 1500000 },
  { month: "May", ingresos: 9200000, gastos: 1750000 },
  { month: "Jun", ingresos: 8500000, gastos: 1800000 },
];

const institutionBreakdown = [
  { name: "BPD", value: 45, color: "#10b981" },
  { name: "BHD", value: 28, color: "#3b82f6" },
  { name: "BL", value: 18, color: "#f59e0b" },
  { name: "Otros", value: 9, color: "#64748b" },
];

const transactions = [
  { date: "2026-06-10", concepto: "Recuperación caso #1042", institucion: "BPD", ingreso: 125000, egreso: 0, balance: 8450000 },
  { date: "2026-06-09", concepto: "Comisión BPD Q2", institucion: "BPD", ingreso: 2300000, egreso: 0, balance: 8325000 },
  { date: "2026-06-09", concepto: "Pago servicios cloud", institucion: "AWS", ingreso: 0, egreso: 45000, balance: 6025000 },
  { date: "2026-06-08", concepto: "Nómina junio (1/2)", institucion: "RRHH", ingreso: 0, egreso: 850000, balance: 6070000 },
  { date: "2026-06-08", concepto: "Recuperación caso #0891", institucion: "BHD", ingreso: 78000, egreso: 0, balance: 6920000 },
  { date: "2026-06-07", concepto: "Pago proveedor legal", institucion: "Externo", ingreso: 0, egreso: 120000, balance: 6842000 },
  { date: "2026-06-07", concepto: "Comisión BHD mayo", institucion: "BHD", ingreso: 1450000, egreso: 0, balance: 6962000 },
  { date: "2026-06-06", concepto: "Recuperación caso #1023", institucion: "BL", ingreso: 45000, egreso: 0, balance: 5512000 },
  { date: "2026-06-06", concepto: "Mantenimiento servidores", institucion: "IT", ingreso: 0, egreso: 35000, balance: 5467000 },
  { date: "2026-06-05", concepto: "Recuperación caso #0998", institucion: "BPD", ingreso: 210000, egreso: 0, balance: 5502000 },
];

const kpiCards = [
  {
    title: "Ingresos mes",
    value: 8500000,
    icon: DollarSign,
    color: "emerald",
    trend: "+12% vs mes anterior",
    trendUp: true,
  },
  {
    title: "Comisiones bancos",
    value: 2300000,
    subtitle: "27% de ingresos",
    icon: Landmark,
    color: "blue",
  },
  {
    title: "Gastos operativos",
    value: 1800000,
    icon: TrendingDown,
    color: "amber",
    trend: "+8% vs mes anterior",
    trendUp: false,
  },
  {
    title: "Utilidad neta",
    value: 4400000,
    subtitle: "52% margen",
    icon: PiggyBank,
    color: "emerald",
    trend: "+15% vs mes anterior",
    trendUp: true,
  },
  {
    title: "Costo por caso",
    value: 1500,
    icon: Calculator,
    color: "slate",
    isCurrency: false,
    trend: "-3% vs mes anterior",
    trendUp: true,
  },
  {
    title: "ROI cartera",
    value: "18.5%",
    icon: BarChart3,
    color: "emerald",
    isRaw: true,
    trend: "+1.2pp vs mes anterior",
    trendUp: true,
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string; text: string }> = {
  emerald: { bg: "bg-emerald-100", icon: "text-emerald-600", border: "border-l-emerald-500", text: "text-emerald-700" },
  blue: { bg: "bg-blue-100", icon: "text-blue-600", border: "border-l-blue-500", text: "text-blue-700" },
  amber: { bg: "bg-amber-100", icon: "text-amber-600", border: "border-l-amber-500", text: "text-amber-700" },
  slate: { bg: "bg-slate-100", icon: "text-slate-600", border: "border-l-slate-500", text: "text-slate-700" },
};

export default function FinancesPage() {
  const [mounted, setMounted] = useState(false);
  const [commissionAmount, setCommissionAmount] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("");
  const [commissionResult, setCommissionResult] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  const handleCalculateCommission = () => {
    const amount = parseFloat(commissionAmount.replace(/,/g, ""));
    const percent = parseFloat(commissionPercent);
    if (!isNaN(amount) && !isNaN(percent)) {
      setCommissionResult((amount * percent) / 100);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CircleDollarSign className="w-7 h-7 text-emerald-600" />
            Finanzas y Rentabilidad
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control de ingresos, comisiones y gastos operativos
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          Junio 2026
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const c = colorMap[kpi.color];
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className={`border-l-4 ${c.border} bg-gradient-to-br from-white to-slate-50/50`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider leading-tight">{kpi.title}</p>
                    <p className="text-xl font-bold text-slate-900 mt-1 truncate">
                      {kpi.isRaw ? kpi.value : kpi.isCurrency === false ? `$${Number(kpi.value).toLocaleString("es-DO")}` : formatCurrency(Number(kpi.value))}
                    </p>
                    {kpi.subtitle && (
                      <p className={`text-xs font-semibold ${c.text} mt-0.5`}>{kpi.subtitle}</p>
                    )}
                    {kpi.trend && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {kpi.trendUp ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-[11px] font-medium ${kpi.trendUp ? "text-emerald-600" : "text-red-600"}`}>
                          {kpi.trend}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 ml-2`}>
                    <Icon className={`w-5 h-5 ${c.icon}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses AreaChart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Ingresos vs Gastos Mensuales
            </CardTitle>
            <CardDescription>Últimos 6 meses — RD$ millones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorIngresos)"
                    name="Ingresos"
                  />
                  <Area
                    type="monotone"
                    dataKey="gastos"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorGastos)"
                    name="Gastos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Institution Breakdown Pie/Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              Ingresos por Institución
            </CardTitle>
            <CardDescription>Distribución por banco cedente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={institutionBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {institutionBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                     formatter={(value) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-3">
              {institutionBreakdown.map((inst) => (
                <div key={inst.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: inst.color }}
                    />
                    <span className="text-sm text-slate-700">{inst.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{inst.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Transactions + Commission Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Transacciones Recientes
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled
              >
                Ver todas
              </Button>
            </div>
            <CardDescription>Últimas 10 operaciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Fecha</TableHead>
                    <TableHead className="text-xs">Concepto</TableHead>
                    <TableHead className="text-xs">Institución</TableHead>
                    <TableHead className="text-xs text-right">Ingreso</TableHead>
                    <TableHead className="text-xs text-right">Egreso</TableHead>
                    <TableHead className="text-xs text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, i) => (
                    <TableRow key={i} className="hover:bg-slate-50">
                      <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("es-DO", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-slate-900">
                        {tx.concepto}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {tx.institucion}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-emerald-700 font-medium text-right">
                        {tx.ingreso > 0 ? formatCurrency(tx.ingreso) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-red-600 font-medium text-right">
                        {tx.egreso > 0 ? formatCurrency(tx.egreso) : "—"}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900 text-right whitespace-nowrap">
                        {formatCurrency(tx.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Commission Calculator */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              Calculadora de Comisión
            </CardTitle>
            <CardDescription>Demo visual — funcionalidad deshabilitada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Monto recuperado (RD$)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Ej: 125,000"
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="pl-9"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  % Comisión
                </label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Ej: 15"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(e.target.value)}
                    className="pl-9"
                    disabled
                  />
                </div>
              </div>
              <Button
                className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
                disabled
                onClick={handleCalculateCommission}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular comisión
              </Button>
              {commissionResult !== null && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
                  <p className="text-xs text-slate-500">Comisión estimada</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {formatCurrency(commissionResult)}
                  </p>
                </div>
              )}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-start gap-2">
                  <Wallet className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    En producción, esta calculadora se conecta a las tarifas contratadas por institución y tipo de producto.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
