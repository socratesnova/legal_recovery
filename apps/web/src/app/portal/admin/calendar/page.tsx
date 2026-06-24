"use client";

import {
  Calendar as CalendarIcon,
  Clock,
  Phone,
  MapPin,
  Gavel,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  AlertCircle,
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

interface CalendarEvent {
  id: string;
  title: string;
  type: "Llamada" | "Visita" | "Audiencia" | "Vencimiento";
  caseRef: string;
  day: string;
  time: string;
  assignedTo: string;
}

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const calendarEvents: CalendarEvent[] = [
  { id: "ev-1", title: "Seguimiento llamada", type: "Llamada", caseRef: "EXP-2024-001", day: "Lunes", time: "09:00", assignedTo: "Ana Pérez" },
  { id: "ev-2", title: "Visita domiciliar", type: "Visita", caseRef: "EXP-2024-015", day: "Lunes", time: "14:00", assignedTo: "Luis Gómez" },
  { id: "ev-3", title: "Audiencia conciliación", type: "Audiencia", caseRef: "EXP-2024-008", day: "Martes", time: "10:30", assignedTo: "Dra. Marta Ruiz" },
  { id: "ev-4", title: "Recordatorio de pago", type: "Llamada", caseRef: "EXP-2024-003", day: "Miércoles", time: "11:00", assignedTo: "Carlos Mendoza" },
  { id: "ev-5", title: "Vencimiento acuerdo #42", type: "Vencimiento", caseRef: "EXP-2024-042", day: "Miércoles", time: "23:59", assignedTo: "Sistema" },
  { id: "ev-6", title: "Visita verificación", type: "Visita", caseRef: "EXP-2024-022", day: "Jueves", time: "15:00", assignedTo: "Luis Gómez" },
  { id: "ev-7", title: "Audiencia judicial", type: "Audiencia", caseRef: "EXP-2024-011", day: "Viernes", time: "09:00", assignedTo: "Dra. Marta Ruiz" },
  { id: "ev-8", title: "Llamada negociación", type: "Llamada", caseRef: "EXP-2024-031", day: "Viernes", time: "16:00", assignedTo: "Ana Pérez" },
];

const todayEvents: CalendarEvent[] = [
  { id: "td-1", title: "Seguimiento llamada", type: "Llamada", caseRef: "EXP-2024-001", day: "Hoy", time: "09:00", assignedTo: "Ana Pérez" },
  { id: "td-2", title: "Audiencia conciliación", type: "Audiencia", caseRef: "EXP-2024-008", day: "Hoy", time: "10:30", assignedTo: "Dra. Marta Ruiz" },
  { id: "td-3", title: "Visita domiciliar", type: "Visita", caseRef: "EXP-2024-015", day: "Hoy", time: "14:00", assignedTo: "Luis Gómez" },
  { id: "td-4", title: "Llamada negociación", type: "Llamada", caseRef: "EXP-2024-031", day: "Hoy", time: "16:00", assignedTo: "Ana Pérez" },
  { id: "td-5", title: "Revisión vencimientos", type: "Vencimiento", caseRef: "EXP-2024-042", day: "Hoy", time: "17:00", assignedTo: "Sistema" },
];

const upcomingDeadlines = [
  { id: "dl-1", title: "Cuota 3/6 — Acuerdo #42", caseRef: "EXP-2024-042", date: "12 Jun 2026", amount: "$8,500", status: "Pendiente" },
  { id: "dl-2", title: "Cuota 5/12 — Acuerdo #17", caseRef: "EXP-2024-017", date: "15 Jun 2026", amount: "$4,200", status: "Pendiente" },
  { id: "dl-3", title: "Pago único — Acuerdo #29", caseRef: "EXP-2024-029", date: "18 Jun 2026", amount: "$12,000", status: "Alerta" },
];

const eventTypeConfig = {
  Llamada: { color: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500", icon: Phone },
  Visita: { color: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", icon: MapPin },
  Audiencia: { color: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500", icon: Gavel },
  Vencimiento: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", icon: AlertCircle },
};

function EventBadge({ type }: { type: CalendarEvent["type"] }) {
  const config = eventTypeConfig[type];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`${config.color} text-xs flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {type}
    </Badge>
  );
}

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendario de Gestiones</h1>
          <p className="text-sm text-slate-500 mt-1">Programación de contactos, visitas y audiencias</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700 px-2">Semana 10 — 8–12 Jun 2026</span>
          <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar view */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              Vista Semanal
            </CardTitle>
            <CardDescription>Lunes a viernes — eventos programados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {weekDays.map((day) => {
                const dayEvents = calendarEvents.filter((e) => e.day === day);
                const isToday = day === "Miércoles";
                const dayNumber = day === "Lunes" ? "8" : day === "Martes" ? "9" : day === "Miércoles" ? "10" : day === "Jueves" ? "11" : "12";
                return (
                  <div key={day} className={`rounded-lg border p-3 min-h-[280px] ${isToday ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 bg-white"}`}>
                    <div className="text-center mb-3">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isToday ? "text-emerald-700" : "text-slate-500"}`}>{day}</p>
                      <p className={`text-lg font-bold ${isToday ? "text-emerald-800" : "text-slate-800"}`}>{dayNumber}</p>
                      {isToday && (
                        <Badge className="bg-emerald-600 text-white text-[10px] mt-1">Hoy</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {dayEvents.map((ev) => {
                        const config = eventTypeConfig[ev.type];
                        return (
                          <div key={ev.id} className="rounded-md border border-slate-200 bg-white p-2 text-xs shadow-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                              <span className="font-medium text-slate-700 truncate">{ev.title}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{ev.time}</span>
                            </div>
                            <p className="text-slate-400 mt-0.5 truncate">{ev.caseRef}</p>
                          </div>
                        );
                      })}
                      {dayEvents.length === 0 && (
                        <p className="text-xs text-slate-300 text-center py-4">Sin eventos</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Leyenda:</span>
              {(Object.keys(eventTypeConfig) as CalendarEvent["type"][]).map((type) => {
                const config = eventTypeConfig[type];
                const Icon = config.icon;
                return (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                    <Icon className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-600">{type}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Today's schedule */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Agenda de Hoy
              </CardTitle>
              <CardDescription>Miércoles, 10 de junio 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <span className="text-xs font-bold text-slate-700">{ev.time}</span>
                      <span className="w-px flex-1 bg-slate-200 min-h-[12px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <EventBadge type={ev.type} />
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{ev.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {ev.caseRef}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ev.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create event form */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Nuevo Evento
              </CardTitle>
              <CardDescription>Programar gestión (solo visual)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Título</Label>
                  <Input placeholder="Ej: Llamada de seguimiento" disabled className="bg-slate-50 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Tipo</Label>
                  <Input placeholder="Llamada, Visita, Audiencia..." disabled className="bg-slate-50 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Expediente</Label>
                  <Input placeholder="EXP-2024-XXX" disabled className="bg-slate-50 text-slate-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Fecha</Label>
                    <Input type="date" disabled className="bg-slate-50 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Hora</Label>
                    <Input type="time" disabled className="bg-slate-50 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Asignado a</Label>
                  <Input placeholder="Gestor o abogado" disabled className="bg-slate-50 text-slate-500" />
                </div>
                <Button disabled className="w-full bg-emerald-700 text-white disabled:bg-emerald-700/50 disabled:text-white/70">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Crear Evento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming deadlines */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" />
            Próximos Vencimientos de Acuerdo
          </CardTitle>
          <CardDescription>Fechas límite de pago próximas a vencer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingDeadlines.map((dl) => (
              <div key={dl.id} className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 bg-white">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{dl.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{dl.caseRef}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="w-3 h-3" />
                      {dl.date}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{dl.amount}</span>
                  </div>
                  <Badge variant="outline" className={`mt-2 text-xs ${dl.status === "Alerta" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-blue-100 text-blue-800 border-blue-200"}`}>
                    {dl.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
