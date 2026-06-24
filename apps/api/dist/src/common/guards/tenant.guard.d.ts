import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { UserRole } from "../decorators/current-user.decorator";
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
        institutionId?: string;
    };
}
export declare class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
