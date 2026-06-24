import { NextRequest, NextResponse } from "next/server";
import { checkFirewall } from "@/lib/legal-firewall";

export async function POST(request: NextRequest) {
  const { caseId, channel } = await request.json();

  if (!caseId || !channel) {
    return NextResponse.json(
      { error: "caseId y channel requeridos" },
      { status: 400 }
    );
  }

  const result = checkFirewall(caseId, channel);

  return NextResponse.json(result);
}