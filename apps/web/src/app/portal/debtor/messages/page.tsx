"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Send,
  BadgeCheck,
} from "lucide-react";
import { formatDate } from "@/lib/seed-data";

const messages = [
  { id: "msg-001", from: "Banco Popular", subject: "Propuesta de acuerdo disponible", body: "Estimado cliente, tenemos una propuesta de acuerdo con 20% de descuento...", date: "2026-06-09T10:00:00Z", read: false, type: "offer" },
  { id: "msg-002", from: "Legal Recovery", subject: "Recordatorio de pago", body: "Su cuota #1 vence el 15 de junio. Por favor realice el pago...", date: "2026-06-08T09:00:00Z", read: true, type: "reminder" },
  { id: "msg-003", from: "Banco BHD", subject: "Actualización de cuenta", body: "Se ha registrado un pago de RD$13,000...", date: "2026-06-07T14:00:00Z", read: true, type: "notification" },
];

export default function DebtorMessagesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-3 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Mensajes</h1>
      <p className="text-xs sm:text-sm text-slate-500">Comunicaciones de tus entidades financieras</p>

      <div className="space-y-3">
        {messages.map((msg) => (
          <Card key={msg.id} className={msg.read ? "" : "border-l-4 border-l-blue-600"}>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {msg.type === "offer" ? <BadgeCheck className="w-5 h-5 text-emerald-700" /> : msg.type === "reminder" ? <Clock className="w-5 h-5 text-amber-700" /> : <Mail className="w-5 h-5 text-blue-700" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-slate-900 break-words">{msg.subject}</span>
                    {!msg.read && <Badge className="bg-blue-600 text-white text-[10px] hover:bg-blue-600">Nuevo</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{msg.from} · {formatDate(msg.date)}</p>
                  <p className="text-sm text-slate-700 mt-1 break-words leading-relaxed">{msg.body}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
