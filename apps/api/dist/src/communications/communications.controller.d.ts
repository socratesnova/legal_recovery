import { CommunicationsService } from "./communications.service";
import { CreateCommunicationDto, UpdateCommunicationDto } from "./dto/create-communication.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class CommunicationsController {
    private readonly service;
    constructor(service: CommunicationsService);
    findAll(caseId: string | undefined, user: AuthenticatedUser): Promise<({
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.CommStatus;
        userId: string | null;
        id: string;
        createdAt: Date;
        caseId: string;
        ipAddress: string | null;
        contactId: string | null;
        channel: import("@prisma/client").$Enums.CommChannel;
        direction: import("@prisma/client").$Enums.CommDirection;
        contentSummary: string | null;
        blocked: boolean;
        blockReason: string | null;
        providerMessageId: string | null;
        simulated: boolean;
    })[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        case: {
            institutionId: string;
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.CommStatus;
        userId: string | null;
        id: string;
        createdAt: Date;
        caseId: string;
        ipAddress: string | null;
        contactId: string | null;
        channel: import("@prisma/client").$Enums.CommChannel;
        direction: import("@prisma/client").$Enums.CommDirection;
        contentSummary: string | null;
        blocked: boolean;
        blockReason: string | null;
        providerMessageId: string | null;
        simulated: boolean;
    }>;
    create(data: CreateCommunicationDto, user: AuthenticatedUser, ip: string): Promise<{
        case: {
            id: string;
            caseNumber: string;
        };
    } & {
        status: import("@prisma/client").$Enums.CommStatus;
        userId: string | null;
        id: string;
        createdAt: Date;
        caseId: string;
        ipAddress: string | null;
        contactId: string | null;
        channel: import("@prisma/client").$Enums.CommChannel;
        direction: import("@prisma/client").$Enums.CommDirection;
        contentSummary: string | null;
        blocked: boolean;
        blockReason: string | null;
        providerMessageId: string | null;
        simulated: boolean;
    }>;
    update(id: string, data: UpdateCommunicationDto, user: AuthenticatedUser): Promise<{
        status: import("@prisma/client").$Enums.CommStatus;
        userId: string | null;
        id: string;
        createdAt: Date;
        caseId: string;
        ipAddress: string | null;
        contactId: string | null;
        channel: import("@prisma/client").$Enums.CommChannel;
        direction: import("@prisma/client").$Enums.CommDirection;
        contentSummary: string | null;
        blocked: boolean;
        blockReason: string | null;
        providerMessageId: string | null;
        simulated: boolean;
    }>;
}
