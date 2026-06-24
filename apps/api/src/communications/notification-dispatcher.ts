import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommChannel, CommStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

export interface DispatchRequest {
  channel: CommChannel;
  /** Destination address/number. `null` for manual channels (PHONE/LETTER/...). */
  to: string | null;
  contentSummary?: string | null;
  caseId: string;
  contactId?: string | null;
}

export interface DispatchResult {
  /** Final status the communication should be persisted with. */
  status: CommStatus;
  /** True when no real provider was configured (dev/staging) or the channel is manual. */
  simulated: boolean;
  /** Provider's message id (e.g. Message-ID header or Twilio SID), when available. */
  providerMessageId: string | null;
  /** Error detail when status === FAILED. */
  error?: string;
}

interface TwilioMessageResponse {
  sid?: string;
  error_code?: number | null;
  error_message?: string | null;
  status?: string;
}

/**
 * Channel adapters for outbound communications. Each channel resolves to one of:
 *  - a real provider (EMAIL/SMS/WHATSAPP) when the relevant credentials are set;
 *  - SIMULATED mode (status=SENT, simulated=true) when they are not — so the full
 *    contact flow works end-to-end in dev without any external service; or
 *  - a manual log (PHONE/LETTER/PORTAL/VOICEBOT) for channels the system records but
 *    does not auto-dispatch (a human performs the action and logs it here).
 *
 * Dispatch never throws: provider failures are returned as { status: FAILED } so the
 * calling request stays robust and the communication record always reflects reality.
 */
@Injectable()
export class NotificationDispatcher {
  private readonly logger = new Logger(NotificationDispatcher.name);
  private transporter: nodemailer.Transporter | undefined;

  constructor(private readonly config: ConfigService) {}

  async dispatch(req: DispatchRequest): Promise<DispatchResult> {
    switch (req.channel) {
      case CommChannel.EMAIL:
        return this.sendEmail(req);
      case CommChannel.SMS:
        return this.sendSms(req);
      case CommChannel.WHATSAPP:
        return this.sendWhatsApp(req);
      default:
        return this.manualLog(req);
    }
  }

  // ---------------- Email (nodemailer / SMTP) ----------------

  private async sendEmail(req: DispatchRequest): Promise<DispatchResult> {
    const host = this.config.get<string>("SMTP_HOST");
    if (!host || !req.to) {
      return this.simulated(req, "email");
    }
    try {
      const transporter = this.getTransporter();
      const from =
        this.config.get<string>("SMTP_FROM") ||
        this.config.get<string>("SMTP_USER") ||
        "no-reply@legal-recovery.local";
      const info = await transporter.sendMail({
        from,
        to: req.to,
        subject: "Legal Recovery OS — notificación",
        text: req.contentSummary ?? "",
      });
      return {
        status: CommStatus.SENT,
        simulated: false,
        providerMessageId: info.messageId ?? null,
      };
    } catch (err) {
      this.logger.error(`Email dispatch failed: ${(err as Error).message}`);
      return {
        status: CommStatus.FAILED,
        simulated: false,
        providerMessageId: null,
        error: (err as Error).message,
      };
    }
  }

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;
    const host = this.config.get<string>("SMTP_HOST");
    const port = Number(this.config.get<string>("SMTP_PORT") ?? 587);
    const user = this.config.get<string>("SMTP_USER");
    const pass = this.config.get<string>("SMTP_PASS");
    this.transporter = nodemailer.createTransport({
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

  // ---------------- SMS / WhatsApp (Twilio REST API) ----------------

  private async sendSms(req: DispatchRequest): Promise<DispatchResult> {
    const sid = this.config.get<string>("TWILIO_ACCOUNT_SID");
    const token = this.config.get<string>("TWILIO_AUTH_TOKEN");
    const from = this.config.get<string>("TWILIO_SMS_FROM");
    if (!sid || !token || !from || !req.to) {
      return this.simulated(req, "sms");
    }
    return this.twilioSend(req, from, sid, token, false);
  }

  private async sendWhatsApp(req: DispatchRequest): Promise<DispatchResult> {
    const sid = this.config.get<string>("TWILIO_ACCOUNT_SID");
    const token = this.config.get<string>("TWILIO_AUTH_TOKEN");
    const from = this.config.get<string>("TWILIO_WHATSAPP_FROM");
    const enabled = this.config.get<string>("WHATSAPP_ENABLED") === "true";
    if (!enabled || !sid || !token || !from || !req.to) {
      return this.simulated(req, "whatsapp");
    }
    return this.twilioSend(req, `whatsapp:${from}`, sid, token, true);
  }

  private async twilioSend(
    req: DispatchRequest,
    from: string,
    sid: string,
    token: string,
    whatsapp: boolean,
  ): Promise<DispatchResult> {
    const to = whatsapp ? `whatsapp:${req.to}` : (req.to as string);
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
          Authorization:
            "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });
      const json = (await res.json()) as TwilioMessageResponse;
      if (!res.ok || json.error_code) {
        return {
          status: CommStatus.FAILED,
          simulated: false,
          providerMessageId: json.sid ?? null,
          error:
            json.error_message ??
            `Twilio error ${json.error_code ?? res.status}`,
        };
      }
      return {
        status: CommStatus.SENT,
        simulated: false,
        providerMessageId: json.sid ?? null,
      };
    } catch (err) {
      this.logger.error(
        `${whatsapp ? "WhatsApp" : "SMS"} dispatch failed: ${(err as Error).message}`,
      );
      return {
        status: CommStatus.FAILED,
        simulated: false,
        providerMessageId: null,
        error: (err as Error).message,
      };
    }
  }

  // ---------------- Manual / simulated ----------------

  private async manualLog(req: DispatchRequest): Promise<DispatchResult> {
    this.logger.log(
      `Manual communication recorded (channel=${req.channel}, case=${req.caseId}) — not auto-dispatched.`,
    );
    return {
      status: CommStatus.SENT,
      simulated: true,
      providerMessageId: null,
    };
  }

  private async simulated(
    req: DispatchRequest,
    kind: string,
  ): Promise<DispatchResult> {
    this.logger.log(
      `Simulated ${kind} dispatch (no provider configured): case=${req.caseId} to=${req.to ?? "n/a"}`,
    );
    return {
      status: CommStatus.SENT,
      simulated: true,
      providerMessageId: `simulated-${randomUUID()}`,
    };
  }
}
