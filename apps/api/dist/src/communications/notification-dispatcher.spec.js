"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const notification_dispatcher_1 = require("./notification-dispatcher");
jest.mock("nodemailer", () => ({
    createTransport: jest.fn(),
}));
const buildDispatcher = async (config) => {
    const configService = {
        get: jest.fn((key) => config[key]),
    };
    const moduleRef = await testing_1.Test.createTestingModule({
        providers: [
            notification_dispatcher_1.NotificationDispatcher,
            { provide: config_1.ConfigService, useValue: configService },
        ],
    }).compile();
    return moduleRef.get(notification_dispatcher_1.NotificationDispatcher);
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
                channel: client_1.CommChannel.EMAIL,
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
                channel: client_1.CommChannel.SMS,
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
                channel: client_1.CommChannel.WHATSAPP,
                to: "+15551234567",
                contentSummary: "pay",
                caseId: "c1",
            });
            expect(r.simulated).toBe(true);
        });
        it("simulates WhatsApp when enabled but Twilio creds are missing", async () => {
            const d = await buildDispatcher({ WHATSAPP_ENABLED: "true" });
            const r = await d.dispatch({
                channel: client_1.CommChannel.WHATSAPP,
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
                channel: client_1.CommChannel.PHONE,
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
                client_1.CommChannel.LETTER,
                client_1.CommChannel.PORTAL,
                client_1.CommChannel.VOICEBOT,
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
            global.fetch = fetchMock;
            const r = await d.dispatch({
                channel: client_1.CommChannel.SMS,
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
            });
            const r = await d.dispatch({
                channel: client_1.CommChannel.SMS,
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
                .mockRejectedValue(new Error("timeout"));
            const r = await d.dispatch({
                channel: client_1.CommChannel.SMS,
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
            nodemailer_1.default.createTransport.mockReturnValue({ sendMail });
            const d = await buildDispatcher({
                SMTP_HOST: "smtp.example.com",
                SMTP_PORT: "587",
                SMTP_USER: "u",
                SMTP_PASS: "p",
                SMTP_FROM: "noreply@example.com",
            });
            const r = await d.dispatch({
                channel: client_1.CommChannel.EMAIL,
                to: "x@y.z",
                contentSummary: "reminder",
                caseId: "c1",
            });
            expect(nodemailer_1.default.createTransport).toHaveBeenCalled();
            expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ from: "noreply@example.com", to: "x@y.z" }));
            expect(r.status).toBe("SENT");
            expect(r.simulated).toBe(false);
            expect(r.providerMessageId).toBe("<abc@host>");
        });
        it("returns FAILED when sendMail rejects", async () => {
            const sendMail = jest.fn().mockRejectedValue(new Error("SMTP down"));
            nodemailer_1.default.createTransport.mockReturnValue({ sendMail });
            const d = await buildDispatcher({
                SMTP_HOST: "smtp.example.com",
                SMTP_FROM: "noreply@example.com",
            });
            const r = await d.dispatch({
                channel: client_1.CommChannel.EMAIL,
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
//# sourceMappingURL=notification-dispatcher.spec.js.map