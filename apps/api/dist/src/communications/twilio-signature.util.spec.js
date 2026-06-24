"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const twilio_signature_util_1 = require("./twilio-signature.util");
const TOKEN = "test-twilio-auth-token";
const URL = "https://api.example.com/api/v1/communications/webhooks/twilio";
function sign(params) {
    const data = URL +
        Object.keys(params)
            .sort()
            .map((k) => k + (params[k] ?? ""))
            .join("");
    return (0, crypto_1.createHmac)("sha1", TOKEN)
        .update(Buffer.from(data, "utf8"))
        .digest("base64");
}
describe("validateTwilioSignature", () => {
    const params = {
        MessageSid: "SM123abc",
        MessageStatus: "delivered",
        To: "+18095551234",
    };
    it("accepts a correctly signed request", () => {
        expect((0, twilio_signature_util_1.validateTwilioSignature)(TOKEN, URL, params, sign(params))).toBe(true);
    });
    it("rejects a tampered signature", () => {
        expect((0, twilio_signature_util_1.validateTwilioSignature)(TOKEN, URL, params, "bogus-signature")).toBe(false);
    });
    it("rejects when params differ from the signed ones", () => {
        const altered = { ...params, MessageStatus: "read" };
        expect((0, twilio_signature_util_1.validateTwilioSignature)(TOKEN, URL, altered, sign(params))).toBe(false);
    });
    it("rejects when the URL differs", () => {
        expect((0, twilio_signature_util_1.validateTwilioSignature)(TOKEN, "https://other.example.com/hook", params, sign(params))).toBe(false);
    });
    it("rejects when the auth token is missing or wrong", () => {
        expect((0, twilio_signature_util_1.validateTwilioSignature)("", URL, params, sign(params))).toBe(false);
        expect((0, twilio_signature_util_1.validateTwilioSignature)("wrong-token", URL, params, sign(params))).toBe(false);
    });
    it("rejects when the signature header is missing", () => {
        expect((0, twilio_signature_util_1.validateTwilioSignature)(TOKEN, URL, params, "")).toBe(false);
    });
});
//# sourceMappingURL=twilio-signature.util.spec.js.map