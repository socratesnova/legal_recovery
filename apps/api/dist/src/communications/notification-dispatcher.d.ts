import { ConfigService } from "@nestjs/config";
import { CommChannel, CommStatus } from "@prisma/client";
export interface DispatchRequest {
    channel: CommChannel;
    to: string | null;
    contentSummary?: string | null;
    caseId: string;
    contactId?: string | null;
}
export interface DispatchResult {
    status: CommStatus;
    simulated: boolean;
    providerMessageId: string | null;
    error?: string;
}
export declare class NotificationDispatcher {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    dispatch(req: DispatchRequest): Promise<DispatchResult>;
    private sendEmail;
    private getTransporter;
    private sendSms;
    private sendWhatsApp;
    private twilioSend;
    private manualLog;
    private simulated;
}
