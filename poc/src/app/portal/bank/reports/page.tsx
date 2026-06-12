'use client'

import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  FileText,
  Download,
  Calendar,
  Mail,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'

const recoveryData = [
  { month: 'May', value: 7.2 },
  { month: 'Jun', value: 8.5 },
]

const reports = [
  {
    id: 1,
    title: 'Reporte Mensual - Junio 2026',
    generated: 'Hoy',
    pages: 12,
    type: 'PDF',
    icon: 'pdf',
    badge: 'Nuevo',
  },
  {
    id: 2,
    title: 'Reporte Trimestral Q2 2026',
    generated: '1 jun. 2026',
    pages: 28,
    type: 'PDF',
    icon: 'pdf',
    badge: null,
  },
  {
    id: 3,
    title: 'Análisis de Calidad Documental',
    generated: '15 may. 2026',
    pages: 8,
    type: 'PDF',
    icon: 'pdf',
    badge: null,
  },
  {
    id: 4,
    title: 'Comparativo Institucional',
    generated: '1 may. 2026',
    pages: 15,
    type: 'PDF',
    icon: 'pdf',
    badge: null,
    meta: 'BPD vs BHD vs BL',
  },
]

const availableDownloads = [
  { name: 'Recuperación por Cartera - Junio 2026', size: '2.4 MB', date: '10 jun. 2026' },
  { name: 'Eficiencia de Contacto - Q2 2026', size: '1.8 MB', date: '1 jun. 2026' },
  { name: 'Score de Propensión - Mayo 2026', size: '3.1 MB', date: '31 may. 2026' },
  { name: 'Compliance y Auditoría - Mayo 2026', size: '1.2 MB', date: '28 may. 2026' },
]

export default function BankReportsPage() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [email, setEmail] = useState('')
  const [scheduled, setScheduled] = useState(false)

  const handleSchedule = () => {
    if (email && scheduleEnabled) {
      setScheduled(true)
      setTimeout(() => setScheduled(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Reportes Ejecutivos</h1>
        <p className="text-slate-600 text-lg">Análisis mensual y trimestral de recuperación</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Report Cards */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Reportes Generados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow border-indigo-100">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <FileText className="w-10 h-10 text-indigo-600" />
                    {report.badge && (
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                        {report.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-1">
                    Generado: <span className="font-medium">{report.generated}</span>
                  </p>
                  <p className="text-xs text-slate-500 mb-2">{report.pages} páginas</p>
                  {report.meta && (
                    <p className="text-xs text-indigo-600 font-medium mb-2">{report.meta}</p>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Indicadores Clave</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monthly Recovery Chart */}
            <Card className="border-indigo-100 md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Recuperación Mensual (RD$M)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recoveryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip
                        formatter={(value) => [`RD$${value}M`, 'Recuperación']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {recoveryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === recoveryData.length - 1 ? '#4338ca' : '#818cf8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">+18%</Badge>
                  <span className="text-slate-600">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Cost per Contact */}
            <Card className="border-indigo-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  Costo por Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Mes anterior</p>
                    <p className="text-2xl font-bold text-slate-400">RD$45</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 mb-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Actual</p>
                    <p className="text-2xl font-bold text-indigo-700">RD$42</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">Mejorando</Badge>
                  <span className="text-xs text-slate-500">-6.7% reducción</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </CardContent>
            </Card>

            {/* Conversion Rate */}
            <Card className="border-indigo-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Tasa de Conversión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Mes anterior</p>
                    <p className="text-2xl font-bold text-slate-400">16.8%</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 mb-1" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Actual</p>
                    <p className="text-2xl font-bold text-indigo-700">18.5%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">+1.7 pp</Badge>
                  <span className="text-xs text-slate-500">incremento puntual</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '74%' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Download Section */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Descargas Disponibles</h2>
          <Card className="border-indigo-100">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {availableDownloads.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 hover:bg-indigo-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <FileText className="w-4.5 h-4.5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {file.size} · {file.date}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Schedule Report */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Automatización</h2>
          <Card className="border-indigo-100">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Programar envío mensual</h3>
                      <p className="text-sm text-slate-500">Recibe el reporte ejecutivo el primer día de cada mes</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="correo@banco.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-56 border-slate-200 focus-visible:ring-indigo-500"
                      disabled={!scheduleEnabled}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={scheduleEnabled}
                      onCheckedChange={setScheduleEnabled}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                    <Button
                      onClick={handleSchedule}
                      disabled={!scheduleEnabled || !email}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {scheduled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Programado
                        </>
                      ) : (
                        'Guardar'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
