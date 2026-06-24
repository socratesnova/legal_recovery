import { DisputesService } from "./disputes.service";
import { CreateDisputeDto, ResolveDisputeDto, UpdateDisputeDto } from "./dto/create-dispute.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class DisputesController {
    private readonly service;
    constructor(service: DisputesService);
    findAll(caseId: string | undefined, user: AuthenticatedUser): Promise<({
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.DisputeStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        caseId: string;
        reason: string;
        openedBy: string;
        openedAt: Date;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolution: string | null;
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.DisputeStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        caseId: string;
        reason: string;
        openedBy: string;
        openedAt: Date;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolution: string | null;
    }>;
    create(data: CreateDisputeDto, user: AuthenticatedUser): Promise<{
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.DisputeStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        caseId: string;
        reason: string;
        openedBy: string;
        openedAt: Date;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolution: string | null;
    }>;
    update(id: string, data: UpdateDisputeDto, user: AuthenticatedUser): Promise<{
        status: import("@prisma/client").$Enums.DisputeStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        caseId: string;
        reason: string;
        openedBy: string;
        openedAt: Date;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolution: string | null;
    }>;
    escalate(id: string, user: AuthenticatedUser): Promise<{
        status: import("@prisma/client").$Enums.DisputeStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        caseId: string;
        reason: string;
        openedBy: string;
        openedAt: Date;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolution: string | null;
    }>;
    resolve(id: string, data: ResolveDisputeDto, user: AuthenticatedUser): Promise<{
        status: import("@prisma/client").$Enums.DisputeStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        caseId: string;
        reason: string;
        openedBy: string;
        openedAt: Date;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolution: string | null;
    }>;
}
