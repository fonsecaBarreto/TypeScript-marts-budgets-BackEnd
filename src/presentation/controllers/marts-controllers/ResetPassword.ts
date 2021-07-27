import { DisagreementPasswordError, MartNotFoundError, SessionExpiredError } from "../../../domain/protocols/Errors";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { Encrypter } from "../../../domain/vendors/Encrypter";
import { Mailer } from "../../../domain/vendors/Mailer";
import { Hasher } from "../../../domain/vendors/Utils";
import { forbidden, success, unauthorized } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { resetPassword as ResetPasswordSchema, changePassword as ChangePasswordSchema } from '../../schemas/mart-schemas.json'
import { UnoComprasTemplate } from '../../helpers/EmailLayouts/UnoCompras'



export class ResetPassword extends MainController {
    constructor(
        private readonly martsRepository: DatabaseAdapter,
        private readonly mailer: Mailer,
        private readonly encrypter: Encrypter,
        private readonly client_url: string
    ){
        super(AccessType.PUBLIC, ResetPasswordSchema)
    }
    async handler(request: Request): Promise<Response> {

       const { credentials } = request.body

       var exists = await this.martsRepository.find({ email: credentials })
       if(!exists) {
           exists = await this.martsRepository.find({ phone: credentials })
           if(!exists){
               exists = await this.martsRepository.find({ cnpj_cpf: credentials })
           }
       }

       if(!exists) throw MartNotFoundError()

       const token = await this.encrypter.sign(exists.id, Math.floor(Date.now() / 1000) + (3600)) // um minuto
 
       this.mailer.send(exists.email, "Reset de Senha",
       UnoComprasTemplate(`<div>
            <h2> Olá ${exists.name}, você solicitou a troca de senha? </h2>
            <h1></h1> <a href="${this.client_url}/change-password?v=${token}&n=${exists.name}"> Trocar Senha </a> <div>`)
       )
       return success()
    }
}

export class ChangePasswordByToken extends MainController {
    constructor(
        private readonly martsRepository: DatabaseAdapter,
        private readonly mailer: Mailer,
        private readonly encrypter: Encrypter,
        private readonly hasher: Hasher
    ){
        super(AccessType.PUBLIC, ChangePasswordSchema)
    }
    async handler(request: Request): Promise<Response> {

       const { query, body } = request
       const { password, passwordConfirmation } = request.body

       if(password !== passwordConfirmation) throw DisagreementPasswordError()

       const token = query.v;
       if(!token) return unauthorized()

        var decoded: any;
        try { decoded = await this.encrypter.decode(token)
        } catch(err){
            switch(err.name){
                case "TokenExpiredError": return forbidden(SessionExpiredError()); break;
                default: return unauthorized()
            }
        }
        if(!decoded) return unauthorized()

        const mart = await this.martsRepository.find({ id: decoded.id })
        if(!mart) throw MartNotFoundError()
        
        const password_hash = await this.hasher.hash(password)
        await this.martsRepository.update({id: decoded.id}, {password: password_hash })

        this.mailer.send(mart.email,"Sua Senha foi trocado", 
        UnoComprasTemplate(`<div> Senha Alterada com sucesso <div>`))

        return success()

    }
}