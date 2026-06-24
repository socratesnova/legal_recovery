"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Shield,
  Sparkles,
  Clock,
} from "lucide-react";

interface ChatMessage {
  role: "ai" | "user";
  content: string;
}

const suggestedQuestions = [
  "¿Cuánto debo pagar este mes?",
  "¿Cómo hago un acuerdo de pago?",
  "¿Qué es una disputa?",
];

const demoConversation: ChatMessage[] = [
  {
    role: "ai",
    content:
      "Tu próximo pago es la cuota 1/3 de RD$33,333. Vence el 15 de junio de 2026. Puedes pagar por transferencia o tarjeta.",
  },
  {
    role: "user",
    content: "¿Y si no puedo pagar?",
  },
  {
    role: "ai",
    content:
      "Si necesitas ajustar tu calendario, puedo ayudarte a solicitar una extensión. Ten en cuenta que esto requiere aprobación del banco.",
  },
];

export default function DebtorChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Hola Juan, soy tu asistente virtual de Legal Recovery. ¿En qué puedo ayudarte hoy?",
    },
  ]);

  const handleSuggestedQuestion = (question: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      ...demoConversation,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Asistente Virtual
            </h1>
          </div>
          <p className="text-slate-600">
            Chat con nuestro asistente AI
          </p>
        </div>

        {/* Chat Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-emerald-50/50 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base font-semibold text-slate-900">
                  Chat de Soporte
                </CardTitle>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              >
                <Shield className="h-3 w-3 mr-1" />
                Conversación protegida · Ley 172-13
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Chat Window */}
            <div className="h-[60vh] md:h-[500px] overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-emerald-600" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestedQuestions.map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      onClick={() => handleSuggestedQuestion(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 p-3 bg-slate-50">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  disabled
                  className="bg-white border-slate-200 text-slate-400"
                />
                <Button
                  size="icon"
                  disabled
                  className="bg-emerald-600 text-white opacity-50 cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Este asistente usa IA. Para decisiones legales, consulta a un
            abogado.
          </p>
        </div>
      </div>
    </div>
  );
}
