import { ConsentType } from "@prisma/client";
import { ConsentsService } from "./consents.service";
import { GrantConsentDto } from "./dto/grant-consent.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class ConsentsController {
    private readonly service;
    constructor(service: ConsentsService);
    findAll(debtorId: string | undefined, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ConsentType;
        debtorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        granted: boolean;
        grantedAt: Date | null;
        revokedAt: Date | null;
    }[]>;
    findByDebtor(debtorId: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ConsentType;
        debtorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        granted: boolean;
        grantedAt: Date | null;
        revokedAt: Date | null;
    }[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ConsentType;
        debtorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        granted: boolean;
        grantedAt: Date | null;
        revokedAt: Date | null;
    }>;
    grant(data: GrantConsentDto, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ConsentType;
        debtorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        granted: boolean;
        grantedAt: Date | null;
        revokedAt: Date | null;
    }>;
    revoke(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ConsentType;
        debtorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        granted: boolean;
        grantedAt: Date | null;
        revokedAt: Date | null;
    }>;
    revokeByType(debtorId: string, type: ConsentType, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.ConsentType;
        debtorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        granted: boolean;
        grantedAt: Date | null;
        revokedAt: Date | null;
    }>;
}
