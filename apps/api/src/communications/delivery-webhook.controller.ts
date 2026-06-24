import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  HttpCode,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { timingSafeEqual } from "crypto";
import { DeliveryReconcilerService } from "./delivery-reconciler.service";
import { validateTwilioSignature } from "./twilio-signature.util";

/**
 * Public webhook endpoints for inbound delivery callbacks. These are NOT
 * authenticated with JWT — providers (Twilio, email) post here directly — so
 * each route authenticates the caller with a provider-specific mechanism:
 *  - /twilio: X-Twilio-Signature HMAC validated against TWILIO_AUTH_TOKEN.
 *  - /delivery: X-Webhook-Secret matched against DELIVERY_WEBHOOK_SECRET.
 * In dev (no secret/token configured) validation is skipped so the flow is
 * testable end-to-end. Always returns 200 to stop provider retry schedules.
 */
@ApiTags("Communications")
@Controller("v1/communications/webhooks")
export class DeliveryWebhookController {
  private readonly logger = new Logger(DeliveryWebhookController.name);

  constructor(
    private readonly reconciler: DeliveryReconcilerService,
    private readonly config: ConfigService,
  ) {}

  @Post("twilio")
  @HttpCode(200)
  @ApiOperation({ summary: "Twilio SMS/WhatsApp delivery status callback" })
  async twilio(
    @Req() req: Request,
    @Body() body: Record<string, string>,
    @Headers("x-twilio-signature") signature: string | undefined,
  ): Promise<{ ok: true; reconciled: boolean }> {
    const messageSid = body?.MessageSid ?? body?.messageSid;
    const messageStatus = body?.MessageStatus ?? body?.messageStatus;
    if (!messageSid || !messageStatus) {
      this.logger.warn("Twilio webhook missing MessageSid/MessageStatus");
      return { ok: true, reconciled: false };
    }

    const token = this.config.get<string>("TWILIO_AUTH_TOKEN");
    if (token) {
      const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      if (!signature || !validateTwilioSignature(token, url, body, signature)) {
        this.logger.warn(`Invalid Twilio webhook signature from ${req.ip}`);
        throw new ForbiddenException("Invalid Twilio signature");
      }
    } else {
      this.logger.warn(
        "TWILIO_AUTH_TOKEN not set — skipping Twilio webhook signature validation (dev mode).",
      );
    }

    const result = await this.reconciler.reconcile({
      providerMessageId: messageSid,
      rawStatus: messageStatus,
      provider: "twilio",
    });
    return { ok: true, reconciled: result?.updated ?? false };
  }

  @Post("delivery")
  @HttpCode(200)
  @ApiOperation({ summary: "Generic delivery status callback (email/other)" })
  async delivery(
    @Body() body: Record<string, unknown>,
    @Headers("x-webhook-secret") secret: string | undefined,
  ): Promise<{ ok: true; reconciled: boolean }> {
    const providerMessageId =
      (body?.providerMessageId as string | undefined) ??
      (body?.messageId as string | undefined);
    const rawStatus = body?.status as string | undefined;
    const provider = (body?.provider as string | undefined) ?? "email";

    if (!providerMessageId || !rawStatus) {
      this.logger.warn("Delivery webhook missing providerMessageId/status");
      return { ok: true, reconciled: false };
    }

    const expected = this.config.get<string>("DELIVERY_WEBHOOK_SECRET");
    if (expected) {
      if (!secret || !safeEqual(secret, expected)) {
        this.logger.warn(
          "Delivery webhook rejected: bad or missing X-Webhook-Secret",
        );
        throw new ForbiddenException("Invalid webhook secret");
      }
    } else {
      this.logger.warn(
        "DELIVERY_WEBHOOK_SECRET not set — skipping generic webhook validation (dev mode).",
      );
    }

    const result = await this.reconciler.reconcile({
      providerMessageId,
      rawStatus,
      provider,
    });
    return { ok: true, reconciled: result?.updated ?? false };
  }
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
