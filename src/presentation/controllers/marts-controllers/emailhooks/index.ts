import { MartModel } from '../../../../domain/entities/MartModel';
import { Mailer } from '../../../../domain/vendors/Mailer'
import { UnoComprasTemplate } from "../../../helpers/EmailLayouts/UnoCompras";


export class SignUpEmailHook {
    constructor(private mailer: Mailer, private hookEmail:string, private client_url:string){}

    async execute(mart:MartModel){
        try{
            
            await this.mailer.send(this.hookEmail,"Novo Usuario Cadastrado", UnoComprasTemplate(`
                <h2 style="text-align:left" > Novo Usuario Cadastrado ao UnoCompra  </h2>
                <ul style="text-align:left">
                <li style="text-align:left color: #333; font-size:18px;"> Nome: ${mart.name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Responsavel: ${mart.responsible_name}</li>
                <li style="text-align:left color: #333; font-size:18px;"> E-mail: ${mart.email}</li>
                <li style="text-align:left color: #333; font-size:18px;"> Telefone: ${mart.phone}</li>
                <a style="margin-top:16px" href="${this.client_url}/admins/marts/update?id=${mart.id}"> Saiba Mais </a>
                </ul>
            `))
            
        }catch(err){ console.log(err) }
    }
}