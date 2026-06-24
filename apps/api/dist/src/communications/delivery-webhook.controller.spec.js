"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const delivery_webhook_controller_1 = require("./delivery-webhook.controller");
function makeConfig(values) {
    return { get: jest.fn((k) => values[k]) };
}
function makeReq() {
    return {
        protocol: "https",
        get: (h) => h.toLowerCase() === "host" ? "api.example.com" : undefined,
        originalUrl: "/api/v1/communications/webhooks/twilio",
        ip: "1.2.3.4",
    };
}
function makeReconciler(result) {
    return {
        reconcile: jest.fn().mockResolvedValue(result),
    };
}
const TWILIO_TOKEN = "test-twilio-token";
const TWILIO_URL = "https://api.example.com/api/v1/communications/webhooks/twilio";
function twilioSig(body) {
    const data = TWILIO_URL +
        Object.keys(body)
            .sort()
            .map((k) => k + (body[k] ?? ""))
            .join("");
    return (0, crypto_1.createHmac)("sha1", TWILIO_TOKEN)
        .update(Buffer.from(data, "utf8"))
        .digest("base64");
}
describe("DeliveryWebhookController", () => {
    describe("POST /twilio", () => {
        it("returns no-op when MessageSid/MessageStatus are missing", async () => {
            const reconciler = makeReconciler(null);
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({}));
            const res = await ctrl.twilio(makeReq(), {}, undefined);
            expect(res).toEqual({ ok: true, reconciled: false });
            expect(reconciler.reconcile).not.toHaveBeenCalled();
        });
        it("reconciles in dev mode (no TWILIO_AUTH_TOKEN)", async () => {
            const reconciler = makeReconciler({
                communicationId: "c1",
                previousStatus: client_1.CommStatus.SENT,
                status: client_1.CommStatus.DELIVERED,
                updated: true,
            });
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({}));
            const res = await ctrl.twilio(makeReq(), { MessageSid: "SM1", MessageStatus: "delivered" }, undefined);
            expect(res).toEqual({ ok: true, reconciled: true });
            expect(reconciler.reconcile).toHaveBeenCalledWith({
                providerMessageId: "SM1",
                rawStatus: "delivered",
                provider: "twilio",
            });
        });
        it("passes with a valid signature and reconciles", async () => {
            const reconciler = makeReconciler({
                communicationId: "c1",
                previousStatus: client_1.CommStatus.SENT,
                status: client_1.CommStatus.READ,
                updated: true,
            });
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({ TWILIO_AUTH_TOKEN: TWILIO_TOKEN }));
            const body = { MessageSid: "SM1", MessageStatus: "read", To: "+1809" };
            const res = await ctrl.twilio(makeReq(), body, twilioSig(body));
            expect(res).toEqual({ ok: true, reconciled: true });
        });
        it("rejects an invalid signature with ForbiddenException", async () => {
            const reconciler = makeReconciler(null);
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({ TWILIO_AUTH_TOKEN: TWILIO_TOKEN }));
            await expect(ctrl.twilio(makeReq(), { MessageSid: "SM1", MessageStatus: "delivered" }, "bad-sig")).rejects.toThrow("Invalid Twilio signature");
            expect(reconciler.reconcile).not.toHaveBeenCalled();
        });
        it("rejects a missing signature when the token is configured", async () => {
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(makeReconciler(null), makeConfig({ TWILIO_AUTH_TOKEN: TWILIO_TOKEN }));
            await expect(ctrl.twilio(makeReq(), { MessageSid: "SM1", MessageStatus: "delivered" }, undefined)).rejects.toThrow("Invalid Twilio signature");
        });
    });
    describe("POST /delivery", () => {
        it("returns no-op when providerMessageId/status are missing", async () => {
            const reconciler = makeReconciler(null);
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({}));
            const res = await ctrl.delivery({}, undefined);
            expect(res).toEqual({ ok: true, reconciled: false });
            expect(reconciler.reconcile).not.toHaveBeenCalled();
        });
        it("reconciles in dev mode (no shared secret)", async () => {
            const reconciler = makeReconciler({
                communicationId: "c1",
                previousStatus: client_1.CommStatus.PENDING,
                status: client_1.CommStatus.SENT,
                updated: true,
            });
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({}));
            const res = await ctrl.delivery({ providerMessageId: "msg-1", status: "delivered" }, undefined);
            expect(res).toEqual({ ok: true, reconciled: true });
            expect(reconciler.reconcile).toHaveBeenCalledWith({
                providerMessageId: "msg-1",
                rawStatus: "delivered",
                provider: "email",
            });
        });
        it("accepts the messageId alias and a custom provider", async () => {
            const reconciler = makeReconciler({
                communicationId: "c1",
                previousStatus: client_1.CommStatus.SENT,
                status: client_1.CommStatus.DELIVERED,
                updated: true,
            });
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({}));
            await ctrl.delivery({ messageId: "msg-1", status: "delivered", provider: "ses" }, undefined);
            expect(reconciler.reconcile).toHaveBeenCalledWith({
                providerMessageId: "msg-1",
                rawStatus: "delivered",
                provider: "ses",
            });
        });
        it("rejects a wrong shared secret with ForbiddenException", async () => {
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(makeReconciler(null), makeConfig({ DELIVERY_WEBHOOK_SECRET: "shh" }));
            await expect(ctrl.delivery({ providerMessageId: "msg-1", status: "delivered" }, "wrong")).rejects.toThrow("Invalid webhook secret");
        });
        it("reconciles with the correct shared secret", async () => {
            const reconciler = makeReconciler({
                communicationId: "c1",
                previousStatus: client_1.CommStatus.SENT,
                status: client_1.CommStatus.DELIVERED,
                updated: true,
            });
            const ctrl = new delivery_webhook_controller_1.DeliveryWebhookController(reconciler, makeConfig({ DELIVERY_WEBHOOK_SECRET: "shh" }));
            const res = await ctrl.delivery({ providerMessageId: "msg-1", status: "delivered" }, "shh");
            expect(res).toEqual({ ok: true, reconciled: true });
        });
    });
});
//# sourceMappingURL=delivery-webhook.controller.spec.js.map