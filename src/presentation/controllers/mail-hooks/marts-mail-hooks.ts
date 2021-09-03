import { UnoComprasTemplate } from "./UnoComprasLayout";
import { MartModel } from '../../../domain/entities/MartModel';
import { Mailer } from '../../../domain/vendors/Mailer'

export class SignUpEmailHook {
    constructor(private mailer: Mailer, private hookEmail:string, private client_url:string){}
    async execute(mart:MartModel){
        try{
            await this.mailer.send(this.hookEmail,"Novo Usuario Cadastrado", UnoComprasTemplate(`
                <h2 style="text-align:left" > Novo Usuario Cadastrado ao UnaCompra  </h2>
                <ul style="text-align:left">
                <li style="text-align:left color: #333; font-size:18px;"> Nome: ${mart.name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Responsavel: ${mart.responsible_name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> E-mail: ${mart.email}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Telefone: ${mart.phone}</li>
                </ul>
                <a style="margin-top:16px" href="${this.client_url}/admins/marts/update?id=${mart.id}"> Saiba Mais </a>
            `))  
        }catch(err){ console.log(err) }
    }
}


export class WelcomEmailEmailHook {
    constructor(private mailer: Mailer, private client_url:string){}

    async execute(mart:MartModel){
        try{
            await this.mailer.send(mart.email,"Bem Vindo ao UnaCompras", UnoComprasTemplate(`
                <h2> Bem Vindo ao UnaCompras  </h2>
                <h2 style=" color: #333; font-size:20px;"> Sua Senha:</h2>
                <h2 style="padding: 10px 32px; border: dashed 3px #ccc; width: fit-content; margin:auto">
                    ${mart.password}
                </h2>
                <a href="${this.client_url}/login"> UnaCompras </a>
                `
            ))  
        }catch(err){ console.log(err) }
    }
}