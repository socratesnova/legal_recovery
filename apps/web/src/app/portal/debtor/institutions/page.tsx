"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

const institutions = [
  { name: "Banco Popular Dominicano", logo: "BPD", debts: 2, total: 3375000, status: "active" },
  { name: "Banco BHD", logo: "BHD", debts: 2, total: 107000, status: "active" },
  { name: "Banco León", logo: "BL", debts: 1, total: 2800000, status: "active" },
];

export default function DebtorInstitutionsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Entidades Financieras</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Instituciones con las que tienes obligaciones</p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {institutions.map((inst) => (
          <Card key={inst.name} className="border-l-4 border-l-emerald-400">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm sm:text-base shrink-0">
                    {inst.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight sm:leading-normal">
                      {inst.name}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {inst.debts} obligaciones · Saldo total: RD${inst.total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className="self-start sm:self-auto bg-emerald-700 text-white hover:bg-emerald-800">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Activa
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
