import { ConsentType } from "@prisma/client";
export declare class GrantConsentDto {
    debtorId: string;
    type: ConsentType;
    ipAddress?: string;
    userAgent?: string;
}
