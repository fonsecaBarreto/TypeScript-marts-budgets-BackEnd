"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpEmailHook = void 0;
const UnoCompras_1 = require("../../../helpers/EmailLayouts/UnoCompras");
class SignUpEmailHook {
    constructor(mailer, hookEmail, client_url) {
        this.mailer = mailer;
        this.hookEmail = hookEmail;
        this.client_url = client_url;
    }
    async execute(mart) {
        try {
            await this.mailer.send(this.hookEmail, "Novo Usuario Cadastrado", UnoCompras_1.UnoComprasTemplate(`
                <h2 style="text-align:left" > Novo Usuario Cadastrado ao UnoCompra  </h2>
                <ul style="text-align:left">
                <li style="text-align:left color: #333; font-size:18px;"> Nome: ${mart.name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Responsavel: ${mart.responsible_name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> E-mail: ${mart.email}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Telefone: ${mart.phone}</li>
                <a style="margin-top:16px" href="${this.client_url}/admins/marts/update?id=${mart.id}"> Saiba Mais </a>
                </ul>
            `));
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.SignUpEmailHook = SignUpEmailHook;
