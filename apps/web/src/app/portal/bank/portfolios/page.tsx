"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { Loader2, AlertTriangle } from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  status: string;
  totalAmount: number;
  currency: string;
  type: string;
  _count?: { cases: number };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(value);
}

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
  if (status === "ACTIVE") {
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

function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();
  const quality = Math.min(100, Math.max(0, Math.round(Number(portfolio.totalAmount) / 100000)));

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{portfolio.name}</CardTitle>
            <CardDescription className="mt-1">
              {portfolio._count?.cases ?? 0} casos
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
            {formatCurrency(Number(portfolio.totalAmount))}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex-1 rounded-lg p-3 ${getQualityBg(quality)}`}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Calidad estimada
            </p>
            <p className={`text-xl font-bold ${getQualityColor(quality)}`}>
              {quality}
            </p>
          </div>
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
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<Portfolio[]>("/portfolios")
      .then((data) => {
        setPortfolios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error cargando carteras");
        setLoading(false);
      });
  }, []);

  const summary = {
    total: portfolios.reduce((sum, p) => sum + Number(p.totalAmount), 0),
    active: portfolios.filter((p) => p.status === "ACTIVE").length,
    avgScore: portfolios.length > 0
      ? Math.round(
          portfolios.reduce((sum, p) => sum + Math.min(100, Math.round(Number(p.totalAmount) / 100000)), 0) /
            portfolios.length
        )
      : 0,
  };

  const filters = {
    todas: portfolios,
    activas: portfolios.filter((p) => p.status === "ACTIVE"),
    cerradas: portfolios.filter((p) => p.status !== "ACTIVE"),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
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
                Total Carteras
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {portfolios.length}
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
                {list.length === 0 && (
                  <div className="col-span-full text-center text-slate-500 py-8">No hay carteras en esta categoría.</div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
