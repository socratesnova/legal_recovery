"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, CheckCircle2 } from "lucide-react";

export function ResetDemo() {
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = () => {
    const confirmed = window.confirm(
      "¿Está seguro de que desea resetear el demo? Se eliminarán todos los datos locales y la sesión actual."
    );
    if (!confirmed) return;

    setResetting(true);

    // Clear localStorage demo keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("demo-") || key.includes("demo"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Also explicitly known keys just in case
    localStorage.removeItem("demo-token");
    localStorage.removeItem("demo-user");

    setMessage("Demo reseteado. Redirigiendo al login...");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md border-red-200 bg-red-50 shadow-sm">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="mt-1 rounded-full bg-red-100 p-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-red-700">Resetear Demo</CardTitle>
          <CardDescription className="text-red-600/90">
            Restaura todos los datos a su estado inicial para una nueva demostración.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Esta acción eliminará todos los datos guardados en este dispositivo para la demo,
            incluyendo la sesión actual. Después será redirigido al login.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleReset}
          disabled={resetting}
          className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {resetting ? "Reseteando..." : "Resetear Todo"}
        </Button>
      </CardFooter>
    </Card>
  );
}
