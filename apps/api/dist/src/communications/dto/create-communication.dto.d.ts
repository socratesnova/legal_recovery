import { CommChannel, CommDirection, CommStatus } from "@prisma/client";
export declare class CreateCommunicationDto {
    caseId: string;
    contactId?: string;
    channel: CommChannel;
    direction?: CommDirection;
    contentSummary?: string;
}
export declare class UpdateCommunicationDto {
    contentSummary?: string;
    status?: CommStatus;
}
