"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailterStub = void 0;
class MailterStub {
    async send(to, subject, html) {
        return console.log(`\nEnviando email para: ${to},
        \nAssunto: ${subject}, 
        \nCorpo: ${html}`);
    }
}
exports.MailterStub = MailterStub;
