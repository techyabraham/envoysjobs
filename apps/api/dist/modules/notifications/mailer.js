"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleMailer = void 0;
class ConsoleMailer {
    async send(options) {
        // eslint-disable-next-line no-console
        console.log("MAIL", options);
    }
}
exports.ConsoleMailer = ConsoleMailer;
