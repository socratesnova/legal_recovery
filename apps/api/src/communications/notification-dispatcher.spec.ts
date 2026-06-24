import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { CommChannel } from "@prisma/client";
import nodemailer from "nodemailer";
import { NotificationDispatcher } from "./notification-dispatcher";

// Mock nodemailer so the email adapter never opens a real SMTP connection.
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(),
}));

type ConfigMap = Record<string, string | undefined>;

const buildDispatcher = async (config: ConfigMap) => {
  const configService = {
    get: jest.fn((key: string) => config[key]),
  } as unknown as ConfigService;
  const moduleRef = await Test.createTestingModule({
    providers: [
      NotificationDispatcher,
      { provide: ConfigService, useValue: configService },
    ],
  }).compile();
  return moduleRef.get(NotificationDispatcher);
};

describe("NotificationDispatcher", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  describe("simulated mode (no provider configured)", () => {
    it("simulates an email when SMTP_HOST is not set", async () => {
      const d = await buildDispatcher({});
      const r = await d.dispatch({
        channel: CommChannel.EMAIL,
        to: "x@y.z",
        contentSummary: "hi",
        caseId: "c1",
      });
      expect(r.status).toBe("SENT");
      expect(r.simulated).toBe(true);
      expect(r.providerMessageId).toMatch(/^simulated-/);
    });

    it("simulates an SMS when Twilio credentials are missing", async () => {
      const d = await buildDispatcher({ WHATSAPP_ENABLED: "true" });
      const r = await d.dispatch({
        channel: CommChannel.SMS,
        to: "+15551234567",
        contentSummary: "pay",
        caseId: "c1",
      });
      expect(r.status).toBe("SENT");
      expect(r.simulated).toBe(true);
    });

    it("simulates WhatsApp when WHATSAPP_ENABLED is not true", async () => {
      const d = await buildDispatcher({
        TWILIO_ACCOUNT_SID: "AC123",
        TWILIO_AUTH_TOKEN: "tok",
        TWILIO_WHATSAPP_FROM: "+15551234567",
      });
      const r = await d.dispatch({
        channel: CommChannel.WHATSAPP,
        to: "+15551234567",
        contentSummary: "pay",
        caseId: "c1",
      });
      expect(r.simulated).toBe(true);
    });

    it("simulates WhatsApp when enabled but Twilio creds are missing", async () => {
      const d = await buildDispatcher({ WHATSAPP_ENABLED: "true" });
      const r = await d.dispatch({
        channel: CommChannel.WHATSAPP,
        to: "+15551234567",
        caseId: "c1",
      });
      expect(r.simulated).toBe(true);
    });
  });

  describe("manual channels", () => {
    it("records a PHONE call as a simulated SENT with no provider id", async () => {
      const d = await buildDispatcher({});
      const r = await d.dispatch({
        channel: CommChannel.PHONE,
        to: null,
        contentSummary: "called, no answer",
        caseId: "c1",
      });
      expect(r.status).toBe("SENT");
      expect(r.simulated).toBe(true);
      expect(r.providerMessageId).toBeNull();
    });

    it("records LETTER/PORTAL/VOICEBOT as manual simulated SENT", async () => {
      const d = await buildDispatcher({});
      for (const channel of [
        CommChannel.LETTER,
        CommChannel.PORTAL,
        CommChannel.VOICEBOT,
      ]) {
        const r = await d.dispatch({
          channel,
          to: null,
          caseId: "c1",
        });
        expect(r.status).toBe("SENT");
        expect(r.simulated).toBe(true);
      }
    });
  });

  describe("real SMS via Twilio REST", () => {
    it("returns SENT with the provider SID on success", async () => {
      const d = await buildDispatcher({
        TWILIO_ACCOUNT_SID: "AC123",
        TWILIO_AUTH_TOKEN: "tok",
        TWILIO_SMS_FROM: "+15550000000",
      });
      const fetchMock = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ sid: "SM456" }) });
      global.fetch = fetchMock as unknown as typeof fetch;

      const r = await d.dispatch({
        channel: CommChannel.SMS,
        to: "+15551234567",
        contentSummary: "pay",
        caseId: "c1",
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toContain("/Accounts/AC123/Messages.json");
      expect(opts.method).toBe("POST");
      expect(r.status).toBe("SENT");
      expect(r.simulated).toBe(false);
      expect(r.providerMessageId).toBe("SM456");
    });

    it("returns FAILED when Twilio reports an error_code", async () => {
      const d = await buildDispatcher({
        TWILIO_ACCOUNT_SID: "AC123",
        TWILIO_AUTH_TOKEN: "tok",
        TWILIO_SMS_FROM: "+15550000000",
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error_code: 21211,
          error_message: "Invalid number",
        }),
      }) as unknown as typeof fetch;

      const r = await d.dispatch({
        channel: CommChannel.SMS,
        to: "bad",
        contentSummary: "pay",
        caseId: "c1",
      });

      expect(r.status).toBe("FAILED");
      expect(r.simulated).toBe(false);
      expect(r.error).toContain("Invalid number");
    });

    it("returns FAILED when the network call throws", async () => {
      const d = await buildDispatcher({
        TWILIO_ACCOUNT_SID: "AC123",
        TWILIO_AUTH_TOKEN: "tok",
        TWILIO_SMS_FROM: "+15550000000",
      });
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error("timeout")) as unknown as typeof fetch;

      const r = await d.dispatch({
        channel: CommChannel.SMS,
        to: "+15551234567",
        caseId: "c1",
      });

      expect(r.status).toBe("FAILED");
      expect(r.error).toContain("timeout");
    });
  });

  describe("real email via nodemailer", () => {
    it("returns SENT with the Message-ID on success", async () => {
      const sendMail = jest.fn().mockResolvedValue({ messageId: "<abc@host>" });
      (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });

      const d = await buildDispatcher({
        SMTP_HOST: "smtp.example.com",
        SMTP_PORT: "587",
        SMTP_USER: "u",
        SMTP_PASS: "p",
        SMTP_FROM: "noreply@example.com",
      });

      const r = await d.dispatch({
        channel: CommChannel.EMAIL,
        to: "x@y.z",
        contentSummary: "reminder",
        caseId: "c1",
      });

      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: "noreply@example.com", to: "x@y.z" }),
      );
      expect(r.status).toBe("SENT");
      expect(r.simulated).toBe(false);
      expect(r.providerMessageId).toBe("<abc@host>");
    });

    it("returns FAILED when sendMail rejects", async () => {
      const sendMail = jest.fn().mockRejectedValue(new Error("SMTP down"));
      (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });

      const d = await buildDispatcher({
        SMTP_HOST: "smtp.example.com",
        SMTP_FROM: "noreply@example.com",
      });

      const r = await d.dispatch({
        channel: CommChannel.EMAIL,
        to: "x@y.z",
        contentSummary: "reminder",
        caseId: "c1",
      });

      expect(r.status).toBe("FAILED");
      expect(r.simulated).toBe(false);
      expect(r.error).toContain("SMTP down");
    });
  });
});
