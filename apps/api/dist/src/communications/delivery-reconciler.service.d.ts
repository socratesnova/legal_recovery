import { CommStatus } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
export interface ReconcileInput {
    providerMessageId: string;
    rawStatus: string;
    provider?: string;
}
export interface ReconcileResult {
    communicationId: string;
    previousStatus: CommStatus;
    status: CommStatus;
    updated: boolean;
}
export declare class DeliveryReconcilerService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    reconcile(input: ReconcileInput): Promise<ReconcileResult | null>;
}
