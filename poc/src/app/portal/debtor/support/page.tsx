"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Phone,
  Mail,
  Clock,
  BookOpen,
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const faqItems = [
  {
    question: "¿Qué es un acuerdo de pago?",
    answer:
      "Un acuerdo de pago es una solución flexible que te permite liquidar tu deuda en cuotas adaptadas a tu capacidad económica. Por ejemplo, si adeudas RD$50,000, podrías acceder a un descuento del 20% y pagar RD$40,000 en 6 cuotas mensuales de RD$6,667.",
  },
  {
    question: "¿Cómo puedo pagar?",
    answer:
      "Disponemos de múltiples opciones: transferencia bancaria desde cualquier banco local, tarjeta de crédito o débito a través de nuestro portal seguro, y depósito en efectivo en sucursales aliadas. Selecciona la opción que mejor se ajuste a ti.",
  },
  {
    question: "¿Qué pasa si no pago?",
    answer:
      "Si no llegamos a un acuerdo, tu caso puede escalar a la etapa legal (judicial o extrajudicial) conforme a la Ley 172-13. Esto incluye reportes ante burós de crédito, embargos cautelares y otras medidas legales. Te recomendamos negociar antes de llegar a este punto.",
  },
  {
    question: "¿Puedo disputar mi deuda?",
    answer:
      "Sí, tienes derecho a disputar los cargos que consideres incorrectos. Puedes presentar una disputa formal a través de este portal indicando el motivo, adjuntando evidencia si la tienes. Nuestro equipo revisará tu caso y responderá dentro de los plazos establecidos por la Ley 172-13.",
  },
  {
    question: "¿Por qué me contactan?",
    answer:
      "Te contactamos en ejercicio de un derecho legalmente reconocido, basado en la relación contractual de crédito mantenida con el Banco Popular. La Ley 172-13 regula nuestra comunicación protegiendo tus derechos y garantizando un trato respetuoso.",
  },
];

const rights = [
  {
    title: "Rectificación",
    description: "Corregir datos personales inexactos o incompletos.",
  },
  {
    title: "Oposición",
    description: "Oponerte al tratamiento de tus datos para fines específicos.",
  },
  {
    title: "Acceso",
    description: "Conocer qué datos personales tenemos y cómo los usamos.",
  },
  {
    title: "Cancelación",
    description: "Solicitar la eliminación de tus datos cuando ya no sean necesarios.",
  },
];

const glossaryTerms = [
  {
    term: "Cartera castigada",
    definition:
      "Deuda que ha dejado de generar intereses para el banco y fue transferida a una firma de cobranzas especializada.",
  },
  {
    term: "Data Passport",
    definition:
      "Registro de origen, base legal y restricciones de uso vinculado a cada dato personal que manejamos.",
  },
  {
    term: "Legal Firewall",
    definition:
      "Sistema automatizado que bloquea el acceso o uso de datos sin base legal, fuente o autorización válida.",
  },
  {
    term: "Paz y salvo",
    definition:
      "Documento que certifica la cancelación total de la deuda y libera al deudor de futuras obligaciones sobre la misma.",
  },
];

export default function DebtorSupportPage() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-slate-900">Centro de Ayuda</h1>
        <p className="text-sm text-slate-500 mt-1">
          Respuestas a preguntas frecuentes sobre tu deuda
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar en ayuda..."
          disabled
          className="pl-10 w-full bg-slate-50 text-slate-400 cursor-not-allowed"
        />
      </div>

      {/* Quick Contact Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            ¿Necesitas hablar con alguien?
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Nuestro equipo está disponible para ayudarte
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>Lunes – Viernes 8:00 – 17:00</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>+1-809-555-0200</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>ayuda@legalrecovery.rd</span>
          </div>
          <div className="pt-2">
            <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
              <Shield className="w-3 h-3 mr-1" />
              Legal Firewall: tu identidad está protegida
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Preguntas Frecuentes
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Todo lo que necesitas saber sobre tu deuda y opciones de pago
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-100 last:border-b-0">
                <AccordionTrigger className="text-sm font-medium text-slate-800 hover:no-underline py-3">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 pb-3">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Legal Rights Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Tus derechos según Ley 172-13
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            La ley de protección de datos personales de República Dominicana garantiza estos derechos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rights.map((right, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
                <p className="text-sm font-semibold text-slate-900">{right.title}</p>
                <p className="text-xs text-slate-600 mt-1">{right.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/portal/debtor/profile">
              <Button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white">
                Ir a Mi Perfil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Glossary */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Glosario
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Términos clave para entender mejor tu situación
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
          {glossaryTerms.map((entry, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50"
            >
              <p className="text-sm font-semibold text-emerald-800">{entry.term}</p>
              <p className="text-xs text-slate-600 mt-1">{entry.definition}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
