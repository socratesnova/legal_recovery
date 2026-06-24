import { createHmac } from "crypto";
import { validateTwilioSignature } from "./twilio-signature.util";

const TOKEN = "test-twilio-auth-token";
const URL = "https://api.example.com/api/v1/communications/webhooks/twilio";

/** Reproduce Twilio's signing algorithm to build a known-good signature. */
function sign(params: Record<string, string>): string {
  const data =
    URL +
    Object.keys(params)
      .sort()
      .map((k) => k + (params[k] ?? ""))
      .join("");
  return createHmac("sha1", TOKEN)
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
    expect(validateTwilioSignature(TOKEN, URL, params, sign(params))).toBe(
      true,
    );
  });

  it("rejects a tampered signature", () => {
    expect(validateTwilioSignature(TOKEN, URL, params, "bogus-signature")).toBe(
      false,
    );
  });

  it("rejects when params differ from the signed ones", () => {
    const altered = { ...params, MessageStatus: "read" };
    expect(validateTwilioSignature(TOKEN, URL, altered, sign(params))).toBe(
      false,
    );
  });

  it("rejects when the URL differs", () => {
    expect(
      validateTwilioSignature(
        TOKEN,
        "https://other.example.com/hook",
        params,
        sign(params),
      ),
    ).toBe(false);
  });

  it("rejects when the auth token is missing or wrong", () => {
    expect(validateTwilioSignature("", URL, params, sign(params))).toBe(false);
    expect(
      validateTwilioSignature("wrong-token", URL, params, sign(params)),
    ).toBe(false);
  });

  it("rejects when the signature header is missing", () => {
    expect(validateTwilioSignature(TOKEN, URL, params, "")).toBe(false);
  });
});
