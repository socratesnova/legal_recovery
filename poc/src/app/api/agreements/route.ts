import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { caseId, terms } = await request.json();

  const agreement = {
    id: `agr-${Date.now()}`,
    caseId,
    createdAt: new Date().toISOString(),
    status: "pending_acceptance",
    terms: {
      ...terms,
      originalBalance: 125000,
      discount: 20,
      discountedBalance: 100000,
      installments: 3,
      installmentAmount: 33334,
    },
    legalBasis: "Mandato de gestión - Banco Popular Dominicano",
    documentUrl: `/documents/agreement-${Date.now()}.pdf`,
  };

  return NextResponse.json(agreement);
}