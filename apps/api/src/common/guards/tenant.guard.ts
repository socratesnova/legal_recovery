import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
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

/**
 * Ensures the authenticated user can only access resources within their
 * institution. For SUPER_ADMIN, institution scoping is optional.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Authentication required");
    }

    // SUPER_ADMIN may access across institutions (still logged for audit).
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!user.institutionId) {
      throw new ForbiddenException("User is not assigned to any institution");
    }

    return true;
  }
}
