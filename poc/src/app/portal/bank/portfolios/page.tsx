"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { formatCurrency } from "@/lib/seed-data";

type Portfolio = {
  id: string;
  name: string;
  status: "active" | "closing";
  amount: number;
  cases: number;
  recovery: number;
  quality: number;
  type: string;
  chart: number[];
};

const portfolios: Portfolio[] = [
  {
    id: "p1",
    name: "Cartera Tarjetas Q2 2026",
    status: "active",
    amount: 12500000,
    cases: 450,
    recovery: 22,
    quality: 85,
    type: "Tarjetas",
    chart: [40, 60, 45, 80, 55],
  },
  {
    id: "p2",
    name: "Préstamos Personales Q1 2026",
    status: "active",
    amount: 18000000,
    cases: 320,
    recovery: 15,
    quality: 78,
    type: "Préstamos",
    chart: [30, 45, 35, 50, 40],
  },
  {
    id: "p3",
    name: "Vehículos 2025 Castigados",
    status: "closing",
    amount: 8500000,
    cases: 180,
    recovery: 35,
    quality: 92,
    type: "Vehículos",
    chart: [60, 70, 65, 90, 80],
  },
  {
    id: "p4",
    name: "Hipotecas Judicializadas",
    status: "active",
    amount: 11000000,
    cases: 250,
    recovery: 8,
    quality: 65,
    type: "Hipotecas",
    chart: [20, 25, 15, 30, 22],
  },
];

function getQualityColor(score: number) {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function getQualityBg(score: number) {
  if (score >= 85) return "bg-emerald-50";
  if (score >= 70) return "bg-blue-50";
  if (score >= 50) return "bg-amber-50";
  return "bg-red-50";
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        Activa
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
      Cerrándose
    </Badge>
  );
}

function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm bg-indigo-300"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{portfolio.name}</CardTitle>
            <CardDescription className="mt-1">
              {portfolio.cases} casos
            </CardDescription>
          </div>
          <StatusBadge status={portfolio.status} />
        </div>
        <Badge variant="outline" className="mt-2 w-fit">
          {portfolio.type}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Monto asignado
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {formatCurrency(portfolio.amount)}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Recuperación
            </p>
            <span className="text-xs font-semibold text-slate-700">
              {portfolio.recovery}%
            </span>
          </div>
          <ProgressPrimitive.Root value={portfolio.recovery} className="w-full">
            <ProgressTrack className="h-2 bg-slate-200 rounded-full">
              <ProgressIndicator className="bg-indigo-600 rounded-full" />
            </ProgressTrack>
          </ProgressPrimitive.Root>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex-1 rounded-lg p-3 ${getQualityBg(
              portfolio.quality
            )}`}
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Calidad
            </p>
            <p
              className={`text-xl font-bold ${getQualityColor(
                portfolio.quality
              )}`}
            >
              {portfolio.quality}
            </p>
          </div>
          <MiniChart values={portfolio.chart} />
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-0">
        <Button
          className="w-full bg-indigo-700 text-white hover:bg-indigo-800"
          onClick={() =>
            router.push(`/portal/bank/portfolios/${portfolio.id}`)
          }
        >
          Ver Detalle
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function BankPortfoliosPage() {
  const summary = useMemo(() => {
    const total = portfolios.reduce((sum, p) => sum + p.amount, 0);
    const active = portfolios.filter((p) => p.status === "active").length;
    const avgRecovery =
      portfolios.reduce((sum, p) => sum + p.recovery, 0) / portfolios.length;
    const avgScore = Math.round(
      portfolios.reduce((sum, p) => sum + p.quality, 0) / portfolios.length
    );
    return { total, active, avgRecovery, avgScore };
  }, []);

  const filters = {
    todas: portfolios,
    activas: portfolios.filter((p) => p.status === "active"),
    cerradas: portfolios.filter((p) => p.status !== "active"),
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Carteras Asignadas
            </h1>
            <p className="text-sm text-slate-500">
              Banco Popular Dominicano
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-block">
                  <Button
                    disabled
                    className="bg-indigo-700 text-white disabled:opacity-50"
                  >
                    Nueva Cartera
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Próximamente</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-indigo-600">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Total Asignado
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {formatCurrency(summary.total)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-indigo-600">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Carteras Activas
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.active}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-indigo-600">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Recuperación Promedio
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.avgRecovery.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-indigo-600">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Score Promedio
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.avgScore}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="todas">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="activas">Activas</TabsTrigger>
            <TabsTrigger value="cerradas">Cerradas</TabsTrigger>
          </TabsList>

          {Object.entries(filters).map(([key, list]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {list.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
