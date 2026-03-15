"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
let MailerService = class MailerService {
    constructor() {
        this.provider = process.env.MAIL_PROVIDER || "console";
    }
    async send(payload) {
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
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)()
], MailerService);
