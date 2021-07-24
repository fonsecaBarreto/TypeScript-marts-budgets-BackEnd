"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodeMailerAdapter {
    constructor(email, password) {
        this.email = email;
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });
    }
    async send(to, subject, html) {
        let mailOptions = {
            from: this.email,
            to, subject, html
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err);
                    console.log('Error occurs');
                }
                console.log('Email sent!!!');
                return resolve();
            });
        });
    }
}
exports.default = NodeMailerAdapter;
