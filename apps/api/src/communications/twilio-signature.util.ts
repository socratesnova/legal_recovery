import { createHmac, timingSafeEqual } from "crypto";

/**
 * Validate a Twilio webhook signature. Twilio computes HMAC-SHA1 over the
 * concatenation of the request URL and each sorted form parameter (key + raw
 * value), using the Twilio AuthToken as the key, base64-encodes it, and sends
 * it in the X-Twilio-Signature header.
 *
 * The `url` MUST be the exact URL Twilio posted to (including protocol/host), as
 * configured in the webhook. Behind a reverse proxy, ensure Express trusts the
 * forwarded headers (app.set("trust proxy", ...)) so req.protocol/host reflect
 * the public URL Twilio signed.
 *
 * @returns true when the signature matches the computed value.
 */
export function validateTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>,
  signature: string,
): boolean {
  if (!authToken || !signature) return false;
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((k) => k + (params[k] ?? ""))
      .join("");
  const expected = createHmac("sha1", authToken)
    .update(Buffer.from(data, "utf8"))
    .digest("base64");
  return safeEqual(expected, signature);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
