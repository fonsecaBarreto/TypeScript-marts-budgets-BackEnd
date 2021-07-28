import { MartAlreadyVerifiedError, MartNotFoundError } from "../../../domain/protocols/Errors";
import { ExpressController } from "../../../domain/protocols/ExpressController";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { Mailer } from "../../../domain/vendors/Mailer";
import { Hasher, IdGenerator, PasswordGenerator } from "../../../domain/vendors/Utils";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { UnoComprasTemplate } from '../../helpers/EmailLayouts/UnoCompras'
import { MakeMartPrivateView } from './serializers/MartPrivateView'
export class JoinMartController extends MainController {
    constructor(
        private readonly marsRepository: DatabaseAdapter,
        private readonly passwordGenerator: PasswordGenerator,
        private readonly hasher: Hasher,
        private readonly mailer: Mailer
    ){
        super(AccessType.ADMIN)
     }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id

        const exists = await this.marsRepository.find({id})
        if(!exists) throw MartNotFoundError()

        if(exists.password) throw MartAlreadyVerifiedError()

        const password = await this.passwordGenerator.generate()

        const password_hash = await this.hasher.hash(password)

        await this.marsRepository.update({id}, { password: password_hash })

        this.mailer.send(exists.email,"Bem Vindo ao UnoCompras", UnoComprasTemplate(`
            <h2> Bem Vindo ao UnoCompra  </h2>
            <h2 style=" color: #333; font-size:20px;"> Sua Senha:</h2>
            <h2 style="padding: 10px 32px; border: dashed 3px #ccc; width: fit-content; margin:auto">
                ${password}
            </h2>
        `))
        const updated = await this.marsRepository.find({id})

        return success(MakeMartPrivateView(updated))

    }

}