import { Mailer } from '../domain/vendors/Mailer'
import nodemailer, { Transporter } from 'nodemailer'

export default class NodeMailerAdapter implements Mailer{

    private readonly transporter: Transporter
    constructor(private readonly email:string, password: string){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });
    }


    async send(to:string, subject:string, html:string ): Promise<void> {
        let mailOptions = {
            from: this.email,
            to,subject, html
        };

        return new Promise((resolve, reject) =>{

            this.transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err)
                    console.log('Error occurs');
                }
                console.log('Email sent!!!');
                return resolve()
            } );

        })
    }
 
}
