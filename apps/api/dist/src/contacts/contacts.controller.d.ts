import { ContactsService } from "./contacts.service";
import { CreateContactDto, UpdateContactDto } from "./dto/create-contact.dto";
import { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class ContactsController {
    private readonly service;
    constructor(service: ContactsService);
    findAll(debtorId: string | undefined, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        debtorId: string;
        channel: import("@prisma/client").$Enums.ContactChannel;
        value: string;
        isPrimary: boolean;
        optIn: boolean;
        optInDate: Date | null;
        dataPassportId: string | null;
    }[]>;
    findById(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        debtorId: string;
        channel: import("@prisma/client").$Enums.ContactChannel;
        value: string;
        isPrimary: boolean;
        optIn: boolean;
        optInDate: Date | null;
        dataPassportId: string | null;
    }>;
    create(data: CreateContactDto, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        debtorId: string;
        channel: import("@prisma/client").$Enums.ContactChannel;
        value: string;
        isPrimary: boolean;
        optIn: boolean;
        optInDate: Date | null;
        dataPassportId: string | null;
    }>;
    update(id: string, data: UpdateContactDto, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        debtorId: string;
        channel: import("@prisma/client").$Enums.ContactChannel;
        value: string;
        isPrimary: boolean;
        optIn: boolean;
        optInDate: Date | null;
        dataPassportId: string | null;
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        debtorId: string;
        channel: import("@prisma/client").$Enums.ContactChannel;
        value: string;
        isPrimary: boolean;
        optIn: boolean;
        optInDate: Date | null;
        dataPassportId: string | null;
    }>;
}
