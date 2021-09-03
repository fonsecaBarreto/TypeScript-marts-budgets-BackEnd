import { MartAlreadyVerifiedError, MartNotFoundError } from "../../../domain/protocols/Errors";

import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { Mailer } from "../../../domain/vendors/Mailer";
import { Hasher, IdGenerator, PasswordGenerator } from "../../../domain/vendors/Utils";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { UnoComprasTemplate } from '../../helpers/EmailLayouts/UnoCompras'

export class JoinMartController extends MainController {
    constructor(
        private readonly marsRepository: DatabaseAdapter,
        private readonly passwordGenerator: PasswordGenerator,
        private readonly hasher: Hasher,
        private readonly hooks:  Function
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

        const updated = await this.marsRepository.find({id})

        try{ this.hooks({ ...updated, password}) }catch(err){console.log(err)}

        return success(updated)

    }

}