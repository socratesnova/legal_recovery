import { AuditAction } from "@prisma/client";
export declare class QueryAuditDto {
    institutionId?: string;
    action?: AuditAction;
    entityType?: string;
    entityId?: string;
    userId?: string;
    from?: string;
    to?: string;
    skip?: number;
    take?: number;
}
