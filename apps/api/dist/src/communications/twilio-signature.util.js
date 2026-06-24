"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTwilioSignature = validateTwilioSignature;
const crypto_1 = require("crypto");
function validateTwilioSignature(authToken, url, params, signature) {
    if (!authToken || !signature)
        return false;
    const data = url +
        Object.keys(params)
            .sort()
            .map((k) => k + (params[k] ?? ""))
            .join("");
    const expected = (0, crypto_1.createHmac)("sha1", authToken)
        .update(Buffer.from(data, "utf8"))
        .digest("base64");
    return safeEqual(expected, signature);
}
function safeEqual(a, b) {
    const ab = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ab.length !== bb.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(ab, bb);
}
//# sourceMappingURL=twilio-signature.util.js.map