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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationDispatcher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatcher = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const nodemailer_1 = __importDefault(require("nodemailer"));
let NotificationDispatcher = NotificationDispatcher_1 = class NotificationDispatcher {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(NotificationDispatcher_1.name);
    }
    async dispatch(req) {
        switch (req.channel) {
            case client_1.CommChannel.EMAIL:
                return this.sendEmail(req);
            case client_1.CommChannel.SMS:
                return this.sendSms(req);
            case client_1.CommChannel.WHATSAPP:
                return this.sendWhatsApp(req);
            default:
                return this.manualLog(req);
        }
    }
    async sendEmail(req) {
        const host = this.config.get("SMTP_HOST");
        if (!host || !req.to) {
            return this.simulated(req, "email");
        }
        try {
            const transporter = this.getTransporter();
            const from = this.config.get("SMTP_FROM") ||
                this.config.get("SMTP_USER") ||
                "no-reply@legal-recovery.local";
            const info = await transporter.sendMail({
                from,
                to: req.to,
                subject: "Legal Recovery OS — notificación",
                text: req.contentSummary ?? "",
            });
            return {
                status: client_1.CommStatus.SENT,
                simulated: false,
                providerMessageId: info.messageId ?? null,
            };
        }
        catch (err) {
            this.logger.error(`Email dispatch failed: ${err.message}`);
            return {
                status: client_1.CommStatus.FAILED,
                simulated: false,
                providerMessageId: null,
                error: err.message,
            };
        }
    }
    getTransporter() {
        if (this.transporter)
            return this.transporter;
        const host = this.config.get("SMTP_HOST");
        const port = Number(this.config.get("SMTP_PORT") ?? 587);
        const user = this.config.get("SMTP_USER");
        const pass = this.config.get("SMTP_PASS");
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: user && pass ? { user, pass } : undefined,
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 15_000,
        });
        return this.transporter;
    }
    async sendSms(req) {
        const sid = this.config.get("TWILIO_ACCOUNT_SID");
        const token = this.config.get("TWILIO_AUTH_TOKEN");
        const from = this.config.get("TWILIO_SMS_FROM");
        if (!sid || !token || !from || !req.to) {
            return this.simulated(req, "sms");
        }
        return this.twilioSend(req, from, sid, token, false);
    }
    async sendWhatsApp(req) {
        const sid = this.config.get("TWILIO_ACCOUNT_SID");
        const token = this.config.get("TWILIO_AUTH_TOKEN");
        const from = this.config.get("TWILIO_WHATSAPP_FROM");
        const enabled = this.config.get("WHATSAPP_ENABLED") === "true";
        if (!enabled || !sid || !token || !from || !req.to) {
            return this.simulated(req, "whatsapp");
        }
        return this.twilioSend(req, `whatsapp:${from}`, sid, token, true);
    }
    async twilioSend(req, from, sid, token, whatsapp) {
        const to = whatsapp ? `whatsapp:${req.to}` : req.to;
        const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
        const body = new URLSearchParams({
            To: to,
            From: from,
            Body: req.contentSummary ?? "",
        });
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
                signal: AbortSignal.timeout(15_000),
            });
            const json = (await res.json());
            if (!res.ok || json.error_code) {
                return {
                    status: client_1.CommStatus.FAILED,
                    simulated: false,
                    providerMessageId: json.sid ?? null,
                    error: json.error_message ??
                        `Twilio error ${json.error_code ?? res.status}`,
                };
            }
            return {
                status: client_1.CommStatus.SENT,
                simulated: false,
                providerMessageId: json.sid ?? null,
            };
        }
        catch (err) {
            this.logger.error(`${whatsapp ? "WhatsApp" : "SMS"} dispatch failed: ${err.message}`);
            return {
                status: client_1.CommStatus.FAILED,
                simulated: false,
                providerMessageId: null,
                error: err.message,
            };
        }
    }
    async manualLog(req) {
        this.logger.log(`Manual communication recorded (channel=${req.channel}, case=${req.caseId}) — not auto-dispatched.`);
        return {
            status: client_1.CommStatus.SENT,
            simulated: true,
            providerMessageId: null,
        };
    }
    async simulated(req, kind) {
        this.logger.log(`Simulated ${kind} dispatch (no provider configured): case=${req.caseId} to=${req.to ?? "n/a"}`);
        return {
            status: client_1.CommStatus.SENT,
            simulated: true,
            providerMessageId: `simulated-${(0, crypto_1.randomUUID)()}`,
        };
    }
};
exports.NotificationDispatcher = NotificationDispatcher;
exports.NotificationDispatcher = NotificationDispatcher = NotificationDispatcher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationDispatcher);
//# sourceMappingURL=notification-dispatcher.js.map