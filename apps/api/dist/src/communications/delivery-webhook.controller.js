"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DeliveryWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const delivery_reconciler_service_1 = require("./delivery-reconciler.service");
const twilio_signature_util_1 = require("./twilio-signature.util");
let DeliveryWebhookController = DeliveryWebhookController_1 = class DeliveryWebhookController {
    constructor(reconciler, config) {
        this.reconciler = reconciler;
        this.config = config;
        this.logger = new common_1.Logger(DeliveryWebhookController_1.name);
    }
    async twilio(req, body, signature) {
        const messageSid = body?.MessageSid ?? body?.messageSid;
        const messageStatus = body?.MessageStatus ?? body?.messageStatus;
        if (!messageSid || !messageStatus) {
            this.logger.warn("Twilio webhook missing MessageSid/MessageStatus");
            return { ok: true, reconciled: false };
        }
        const token = this.config.get("TWILIO_AUTH_TOKEN");
        if (token) {
            const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
            if (!signature || !(0, twilio_signature_util_1.validateTwilioSignature)(token, url, body, signature)) {
                this.logger.warn(`Invalid Twilio webhook signature from ${req.ip}`);
                throw new common_1.ForbiddenException("Invalid Twilio signature");
            }
        }
        else {
            this.logger.warn("TWILIO_AUTH_TOKEN not set — skipping Twilio webhook signature validation (dev mode).");
        }
        const result = await this.reconciler.reconcile({
            providerMessageId: messageSid,
            rawStatus: messageStatus,
            provider: "twilio",
        });
        return { ok: true, reconciled: result?.updated ?? false };
    }
    async delivery(body, secret) {
        const providerMessageId = body?.providerMessageId ??
            body?.messageId;
        const rawStatus = body?.status;
        const provider = body?.provider ?? "email";
        if (!providerMessageId || !rawStatus) {
            this.logger.warn("Delivery webhook missing providerMessageId/status");
            return { ok: true, reconciled: false };
        }
        const expected = this.config.get("DELIVERY_WEBHOOK_SECRET");
        if (expected) {
            if (!secret || !safeEqual(secret, expected)) {
                this.logger.warn("Delivery webhook rejected: bad or missing X-Webhook-Secret");
                throw new common_1.ForbiddenException("Invalid webhook secret");
            }
        }
        else {
            this.logger.warn("DELIVERY_WEBHOOK_SECRET not set — skipping generic webhook validation (dev mode).");
        }
        const result = await this.reconciler.reconcile({
            providerMessageId,
            rawStatus,
            provider,
        });
        return { ok: true, reconciled: result?.updated ?? false };
    }
};
exports.DeliveryWebhookController = DeliveryWebhookController;
__decorate([
    (0, common_1.Post)("twilio"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Twilio SMS/WhatsApp delivery status callback" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)("x-twilio-signature")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], DeliveryWebhookController.prototype, "twilio", null);
__decorate([
    (0, common_1.Post)("delivery"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Generic delivery status callback (email/other)" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("x-webhook-secret")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DeliveryWebhookController.prototype, "delivery", null);
exports.DeliveryWebhookController = DeliveryWebhookController = DeliveryWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)("Communications"),
    (0, common_1.Controller)("v1/communications/webhooks"),
    __metadata("design:paramtypes", [delivery_reconciler_service_1.DeliveryReconcilerService,
        config_1.ConfigService])
], DeliveryWebhookController);
function safeEqual(a, b) {
    const ab = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ab.length !== bb.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(ab, bb);
}
//# sourceMappingURL=delivery-webhook.controller.js.map