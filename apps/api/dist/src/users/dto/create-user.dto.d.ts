import { UserRole, EntityStatus } from "@prisma/client";
export declare class CreateUserDto {
    email: string;
    name: string;
    role: UserRole;
    institutionId?: string;
    password?: string;
    status?: EntityStatus;
    mfaEnabled?: boolean;
}
