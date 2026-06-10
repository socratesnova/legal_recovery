import { NextRequest, NextResponse } from "next/server";
import { authenticateDemo, createDemoToken } from "@/lib/demo-auth";

export async function POST(request: NextRequest) {
  const { email, password, totp } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña requeridos" },
      { status: 400 }
    );
  }

  const user = authenticateDemo(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  if (totp !== "123456") {
    return NextResponse.json(
      { error: "Código MFA inválido" },
      { status: 401 }
    );
  }

  const token = await createDemoToken(user);

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}