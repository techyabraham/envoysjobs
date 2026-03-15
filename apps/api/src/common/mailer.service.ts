import { Injectable } from "@nestjs/common";

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
          from: "EnvoysJobs <no-reply@envoysjobs.com>",
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

    // console fallback
    console.log("[Mailer]", payload.subject, payload.to, payload.text ?? payload.html ?? "");
    return { status: "sent" };
  }
}
