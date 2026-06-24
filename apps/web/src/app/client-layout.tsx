"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      {children}
      <Toaster richColors position="top-right" />
    </TooltipProvider>
  );
}
