export interface Mailer {
  send(options: { to: string; subject: string; html: string }): Promise<void>;
}

export class ConsoleMailer implements Mailer {
  async send(options: { to: string; subject: string; html: string }) {
    // eslint-disable-next-line no-console
    console.log("MAIL", options);
  }
}
