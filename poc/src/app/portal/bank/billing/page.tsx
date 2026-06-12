'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Receipt,
  DollarSign,
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { formatCurrency } from '@/lib/seed-data'

const currentPeriod = {
  period: 'Junio 2026',
  recovered: 8_500_000,
  commissionRate: 0.20,
  commission: 1_700_000,
  deductibleExpenses: 400_000,
  net: 1_300_000,
  status: 'Pendiente de facturación',
}

const invoiceHistory = [
  { id: 1, period: 'May 2026', amount: 1_100_000, status: 'paid' as const },
  { id: 2, period: 'Apr 2026', amount: 980_000, status: 'paid' as const },
  { id: 3, period: 'Mar 2026', amount: 1_200_000, status: 'paid' as const },
  { id: 4, period: 'Feb 2026', amount: 850_000, status: 'paid' as const },
  { id: 5, period: 'Jan 2026', amount: 920_000, status: 'paid' as const },
  { id: 6, period: 'Dec 2025', amount: 750_000, status: 'paid' as const },
]

const portfolioBreakdown = [
  { name: 'Tarjetas de Crédito', value: 900_000, color: '#4338ca' },
  { name: 'Préstamos Personales', value: 550_000, color: '#6366f1' },
  { name: 'Préstamos Hipotecarios', value: 250_000, color: '#a5b4fc' },
]

const paymentMethod = {
  bank: 'Banco Popular Dominicano (BPD)',
  account: '**** **** **** 4821',
  type: 'Transferencia bancaria',
}

export default function BankBillingPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2 flex items-center gap-3">
            <Receipt className="w-8 h-8 text-indigo-700" />
            Facturación y Comisiones
          </h1>
          <p className="text-slate-600 text-lg">
            Detalle de servicios y comisiones de recuperación
          </p>
        </div>

        <div className="space-y-8">
          {/* Current Period Card */}
          <section>
            <Card className="border-indigo-100">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Periodo Actual: {currentPeriod.period}
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                    {currentPeriod.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-indigo-50">
                    <p className="text-xs text-slate-500 mb-1">Monto recuperado</p>
                    <p className="text-xl font-bold text-indigo-900">
                      {formatCurrency(currentPeriod.recovered)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-indigo-50">
                    <p className="text-xs text-slate-500 mb-1">Comisión (20%)</p>
                    <p className="text-xl font-bold text-indigo-900">
                      {formatCurrency(currentPeriod.commission)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-indigo-50">
                    <p className="text-xs text-slate-500 mb-1">Gastos deducibles</p>
                    <p className="text-xl font-bold text-indigo-900">
                      {formatCurrency(currentPeriod.deductibleExpenses)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-indigo-700 text-white">
                    <p className="text-xs text-indigo-200 mb-1">Neto a pagar</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(currentPeriod.net)}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    disabled
                    className="bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Factura
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Invoice History */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Historial de Facturas
            </h2>
            <Card className="border-indigo-100">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {invoiceHistory.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 hover:bg-indigo-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <FileText className="w-4.5 h-4.5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {invoice.period}
                          </p>
                          <p className="text-xs text-slate-500">
                            Comisión de recuperación
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-indigo-900">
                          {formatCurrency(invoice.amount)}
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Pagada
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Commission Breakdown */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Desglose por Cartera
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-indigo-100">
                <CardContent className="p-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {portfolioBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={((value) => [
                            formatCurrency(value),
                            'Comisión',
                          ]) as any}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-indigo-100">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {portfolioBreakdown.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium text-slate-900">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-indigo-900">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-4 bg-indigo-50">
                      <span className="text-sm font-semibold text-indigo-900">
                        Total
                      </span>
                      <span className="text-sm font-bold text-indigo-900">
                        {formatCurrency(
                          portfolioBreakdown.reduce(
                            (acc, i) => acc + i.value,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Método de Pago
            </h2>
            <Card className="border-indigo-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {paymentMethod.type}
                    </p>
                    <p className="text-sm text-slate-600">
                      {paymentMethod.bank}
                    </p>
                    <p className="text-sm text-slate-500">
                      Cuenta: {paymentMethod.account}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
