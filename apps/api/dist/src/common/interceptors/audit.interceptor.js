"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, route, body, params } = request;
        if (!this.isMutating(method)) {
            return next.handle();
        }
        const entityType = this.extractEntityType(route?.path);
        const entityId = params?.id;
        const actor = request.user;
        const beforeSnapshot = entityId ? this.captureSnapshot(body) : undefined;
        return next.handle().pipe((0, rxjs_1.tap)(async (_response) => {
            try {
                await this.prisma.auditLog.create({
                    data: {
                        userId: actor?.userId,
                        institutionId: actor?.institutionId,
                        action: this.mapMethodToAction(method),
                        entityType: (entityType || "Unknown"),
                        entityId: (entityId ||
                            "00000000-0000-0000-0000-000000000000"),
                        changesJson: beforeSnapshot,
                        ipAddress: this.extractIp(request),
                        userAgent: this.stringifyIfNeeded(request.headers["user-agent"])?.substring(0, 512),
                    },
                });
            }
            catch (err) {
                console.error("Audit logging failed", err);
            }
        }));
    }
    isMutating(method) {
        return ["POST", "PATCH", "PUT", "DELETE"].includes(method.toUpperCase());
    }
    mapMethodToAction(method) {
        switch (method.toUpperCase()) {
            case "POST":
                return "CREATE";
            case "PATCH":
            case "PUT":
                return "UPDATE";
            case "DELETE":
                return "DELETE";
            default:
                return "VIEW";
        }
    }
    extractEntityType(path) {
        if (!path)
            return undefined;
        const segments = path.split("/").filter(Boolean);
        const resource = segments.find((segment) => !segment.startsWith(":") &&
            !/^v\d+$/.test(segment) &&
            segment !== "api");
        return resource ? this.toPascalCase(resource) : undefined;
    }
    toPascalCase(value) {
        const singular = value.endsWith("s") ? value.slice(0, -1) : value;
        return singular
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join("");
    }
    captureSnapshot(body) {
        if (!body || typeof body !== "object")
            return undefined;
        const sensitive = new Set([
            "password",
            "passwordHash",
            "token",
            "secret",
            "mfaSecret",
        ]);
        const snapshot = {};
        for (const [key, value] of Object.entries(body)) {
            if (!sensitive.has(key)) {
                snapshot[key] = value;
            }
        }
        return Object.keys(snapshot).length > 0 ? snapshot : undefined;
    }
    extractIp(request) {
        const forwarded = request.headers["x-forwarded-for"];
        if (typeof forwarded === "string") {
            return forwarded.split(",")[0].trim();
        }
        return request.ip || request.socket?.remoteAddress || undefined;
    }
    stringifyIfNeeded(value) {
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        return value;
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map