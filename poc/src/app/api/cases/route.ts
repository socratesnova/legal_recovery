import { NextResponse } from "next/server";
import { demoCases, formatCurrency } from "@/lib/seed-data";

export async function GET() {
  const cases = demoCases.map((c) => ({
    id: c.id,
    debtorName: c.debtor.name,
    debtorId: c.debtor.idNumber,
    product: c.product,
    balance: c.balance,
    balanceFormatted: formatCurrency(c.balance),
    status: c.status,
    scores: c.scores,
    contactability: c.debtor.phone.allowed,
    nextAction: c.nextBestAction.channel,
  }));

  return NextResponse.json(cases);
}