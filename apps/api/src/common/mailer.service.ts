import { Injectable, ServiceUnavailableException } from "@nestjs/common";

export type MailerPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

@Injectable()
export class MailerService {
  private provider = process.env.MAIL_PROVIDER || "console";

  async send(payload: MailerPayload) {
    if (this.provider === "resend") {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        return { status: "skipped", reason: "Missing RESEND_API_KEY" };
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || "EnvoysJobs <no-reply@envoysjobs.com>",
          to: payload.to,
          subject: payload.subject,
          html: payload.html ?? payload.text
        })
      });
      if (!res.ok) {
        return { status: "failed", reason: await res.text() };
      }
      return { status: "sent" };
    }

    // Local-only console fallback.
    if (process.env.NODE_ENV !== "production") {
      console.log("[Mailer]", payload.subject, payload.to, payload.text ?? payload.html ?? "");
    }
    return { status: "sent" };
  }

  async sendRequired(payload: MailerPayload) {
    if (this.provider !== "resend" || !process.env.RESEND_API_KEY) {
      if (process.env.NODE_ENV === "production") {
        throw new ServiceUnavailableException("Transactional email is not configured");
      }
      console.log("[Mailer preview]", payload.subject, payload.to, payload.text ?? payload.html ?? "");
      return { status: "previewed" };
    }
    const result = await this.send(payload);
    if (result.status !== "sent") throw new ServiceUnavailableException("Email delivery failed");
    return result;
  }

  async sendSmsRequired(payload: { to: string; text: string }) {
    const provider = process.env.SMS_PROVIDER || "console";
    if (provider === "twilio") {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_FROM_NUMBER;
      if (!accountSid || !authToken || !from) {
        throw new ServiceUnavailableException("SMS delivery is not configured");
      }
      const form = new URLSearchParams({ To: payload.to, From: from, Body: payload.text });
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form
      });
      if (!response.ok) throw new ServiceUnavailableException("SMS delivery failed");
      return { status: "sent" };
    }

    if (provider !== "console") throw new ServiceUnavailableException("Unsupported SMS provider");
    if (process.env.NODE_ENV === "production") {
      throw new ServiceUnavailableException("SMS delivery is not configured");
    }
    console.log("[SMS preview]", payload.to, payload.text);
    return { status: "previewed" };
  }
}
