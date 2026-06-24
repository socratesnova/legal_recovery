import { ContactChannel } from "@prisma/client";
export declare class CreateContactDto {
    debtorId: string;
    channel: ContactChannel;
    value: string;
    isPrimary?: boolean;
    optIn?: boolean;
    optInDate?: string;
    dataPassportId?: string;
}
export declare class UpdateContactDto {
    value?: string;
    isPrimary?: boolean;
    optIn?: boolean;
    optInDate?: string;
    dataPassportId?: string;
}
