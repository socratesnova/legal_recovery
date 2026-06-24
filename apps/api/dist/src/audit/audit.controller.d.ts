import { AuditService } from "./audit.service";
import { QueryAuditDto } from "./dto/query-audit.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class AuditController {
    private readonly service;
    constructor(service: AuditService);
    findAll(query: QueryAuditDto, user: AuthenticatedUser): Promise<{
        items: {
            institutionId: string | null;
            userId: string | null;
            id: string;
            createdAt: Date;
            action: import("@prisma/client").$Enums.AuditAction;
            entityType: string;
            entityId: string;
            changesJson: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
        total: number;
        skip: number;
        take: number;
    }>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        institutionId: string | null;
        userId: string | null;
        id: string;
        createdAt: Date;
        action: import("@prisma/client").$Enums.AuditAction;
        entityType: string;
        entityId: string;
        changesJson: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
