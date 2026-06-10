import { SignJWT, jwtVerify } from "jose";
import type { DemoUser } from "./types";
import { demoUsers } from "./seed-data";

const SECRET = new TextEncoder().encode("legal-recovery-demo-secret-key-2026");
const ALG = "HS256";

export async function createDemoToken(user: DemoUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    institutionId: user.institutionId,
  })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyDemoToken(token: string): Promise<DemoUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as DemoUser["role"],
      institutionId: payload.institutionId as string,
    };
  } catch {
    return null;
  }
}

export function authenticateDemo(email: string, password: string): DemoUser | null {
  if (password !== "demo123") return null;
  return demoUsers.find((u) => u.email === email) ?? null;
}