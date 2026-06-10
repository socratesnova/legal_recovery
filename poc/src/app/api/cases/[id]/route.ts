import { NextRequest, NextResponse } from "next/server";
import { demoCases } from "@/lib/seed-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const caseData = demoCases.find((c) => c.id === id);

  if (!caseData) {
    return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
  }

  return NextResponse.json(caseData);
}