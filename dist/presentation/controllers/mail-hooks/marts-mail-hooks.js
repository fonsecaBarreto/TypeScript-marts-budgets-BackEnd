"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomEmailEmailHook = exports.SignUpEmailHook = void 0;
const UnoComprasLayout_1 = require("./UnoComprasLayout");
class SignUpEmailHook {
    constructor(mailer, hookEmail, client_url) {
        this.mailer = mailer;
        this.hookEmail = hookEmail;
        this.client_url = client_url;
    }
    async execute(mart) {
        try {
            await this.mailer.send(this.hookEmail, "Novo Usuario Cadastrado", UnoComprasLayout_1.UnoComprasTemplate(`
                <h2 style="text-align:left" > Novo Usuario Cadastrado ao UnaCompra  </h2>
                <ul style="text-align:left">
                <li style="text-align:left color: #333; font-size:18px;"> Nome: ${mart.name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Responsavel: ${mart.responsible_name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> E-mail: ${mart.email}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Telefone: ${mart.phone}</li>
                </ul>
                <a style="margin-top:16px" href="${this.client_url}/admins/marts/update?id=${mart.id}"> Saiba Mais </a>
            `));
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.SignUpEmailHook = SignUpEmailHook;
class WelcomEmailEmailHook {
    constructor(mailer, client_url) {
        this.mailer = mailer;
        this.client_url = client_url;
    }
    async execute(mart) {
        try {
            await this.mailer.send(mart.email, "Bem Vindo ao UnaCompras", UnoComprasLayout_1.UnoComprasTemplate(`
                <h2> Bem Vindo ao UnaCompras  </h2>
                <h2 style=" color: #333; font-size:20px;"> Sua Senha:</h2>
                <h2 style="padding: 10px 32px; border: dashed 3px #ccc; width: fit-content; margin:auto">
                    ${mart.password}
                </h2>
                <a href="${this.client_url}/login"> UnaCompras </a>
                `));
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.WelcomEmailEmailHook = WelcomEmailEmailHook;
