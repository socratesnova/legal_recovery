import { PrismaService } from "../common/prisma.service";
import { GrantConsentDto } from "./dto/grant-consent.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class ConsentsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    grant(dto: GrantConsentDto, user: AuthenticatedUser): Promise<{
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
    revokeByType(debtorId: string, type: import("@prisma/client").ConsentType, user: AuthenticatedUser): Promise<{
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
    private getTenantDebtorIds;
    private assertDebtorInTenant;
}
