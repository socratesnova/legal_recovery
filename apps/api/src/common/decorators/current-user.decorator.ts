import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

// Values MUST match the Prisma `UserRole` enum (apps/api/prisma/schema.prisma).
// Prisma persists enum members by their member name in UPPER_CASE, and the JWT
// carries that exact string (auth.service.login signs `role` straight from the
// Prisma row). A lowercase value here would never match the JWT role, which
// silently broke every @Roles guard (always 403) and every
// `user.role === UserRole.SUPER_ADMIN` bypass (always fell through to the
// restricted branch). Keep these uppercase and in sync with the schema.
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  GESTOR = "GESTOR",
  ABOGADO = "ABOGADO",
  COMPLIANCE = "COMPLIANCE",
  BANCO = "BANCO",
  DEUDOR = "DEUDOR",
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  institutionId?: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    return data ? user?.[data] : user;
  },
);

export const CurrentInstitution = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    return user?.institutionId;
  },
);
