import { Mailer } from "../../../../domain/vendors/Mailer";

export class MailterStub implements Mailer {
    async send(to: string, subject: string, html: string): Promise<void> {
        return console.log(`\nEnviando email para: ${to},
        \nAssunto: ${subject}, 
        \nCorpo: ${html}`)
    }
}
