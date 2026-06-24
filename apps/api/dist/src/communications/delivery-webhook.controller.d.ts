import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { DeliveryReconcilerService } from "./delivery-reconciler.service";
export declare class DeliveryWebhookController {
    private readonly reconciler;
    private readonly config;
    private readonly logger;
    constructor(reconciler: DeliveryReconcilerService, config: ConfigService);
    twilio(req: Request, body: Record<string, string>, signature: string | undefined): Promise<{
        ok: true;
        reconciled: boolean;
    }>;
    delivery(body: Record<string, unknown>, secret: string | undefined): Promise<{
        ok: true;
        reconciled: boolean;
    }>;
}
