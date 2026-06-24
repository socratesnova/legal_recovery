import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Request } from "express";
import { Observable, tap } from "rxjs";
import { PrismaService } from "../prisma.service";
import { AuditAction } from "@prisma/client";
import { AuthenticatedUser } from "../decorators/current-user.decorator";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, route, body, params } = request;

    // Only audit mutating requests for now. GET requests may be added later
    // for sensitive downloads or data exports.
    if (!this.isMutating(method)) {
      return next.handle();
    }

    const entityType = this.extractEntityType(route?.path);
    const entityId = params?.id;
    const actor = request.user as AuthenticatedUser | undefined;

    const beforeSnapshot = entityId ? this.captureSnapshot(body) : undefined;

    return next.handle().pipe(
      tap(async (_response) => {
        try {
          await this.prisma.auditLog.create({
            data: {
              userId: actor?.userId,
              institutionId: actor?.institutionId,
              action: this.mapMethodToAction(method),
              entityType: (entityType || "Unknown") as string,
              entityId: (entityId ||
                "00000000-0000-0000-0000-000000000000") as string,
              changesJson: beforeSnapshot as unknown as
                | import("@prisma/client").Prisma.InputJsonValue
                | import("@prisma/client").Prisma.NullableJsonNullValueInput,
              ipAddress: this.extractIp(request),
              userAgent: this.stringifyIfNeeded(
                request.headers["user-agent"],
              )?.substring(0, 512) as string | undefined,
            },
          });
        } catch (err) {
          // Audit logging must never break the user-facing response.
          // In production, send this to a separate error tracker.
          console.error("Audit logging failed", err);
        }
      }),
    );
  }

  private isMutating(method: string): boolean {
    return ["POST", "PATCH", "PUT", "DELETE"].includes(method.toUpperCase());
  }

  private mapMethodToAction(method: string): AuditAction {
    switch (method.toUpperCase()) {
      case "POST":
        return "CREATE";
      case "PATCH":
      case "PUT":
        return "UPDATE";
      case "DELETE":
        return "DELETE";
      default:
        // AuditAction has VIEW (not READ) for non-mutating observations.
        return "VIEW";
    }
  }

  private extractEntityType(path?: string): string | undefined {
    if (!path) return undefined;
    // path is usually '/api/v1/cases/:id' or '/v1/cases' depending on versioning.
    const segments = path.split("/").filter(Boolean);
    const resource = segments.find(
      (segment) =>
        !segment.startsWith(":") &&
        !/^v\d+$/.test(segment) &&
        segment !== "api",
    );
    return resource ? this.toPascalCase(resource) : undefined;
  }

  private toPascalCase(value: string): string {
    // e.g. 'data-passports' -> 'DataPassport', 'cases' -> 'Case'
    const singular = value.endsWith("s") ? value.slice(0, -1) : value;
    return singular
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  private captureSnapshot(body: unknown): Record<string, unknown> | undefined {
    if (!body || typeof body !== "object") return undefined;
    // Remove sensitive fields before storing.
    const sensitive = new Set([
      "password",
      "passwordHash",
      "token",
      "secret",
      "mfaSecret",
    ]);
    const snapshot: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!sensitive.has(key)) {
        snapshot[key] = value;
      }
    }
    return Object.keys(snapshot).length > 0 ? snapshot : undefined;
  }

  private extractIp(request: Request): string | undefined {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return request.ip || request.socket?.remoteAddress || undefined;
  }

  private stringifyIfNeeded(
    value: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  }
}
