import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { Encrypter } from "../../../domain/vendors/Encrypter";
import { Hasher } from "../../../domain/vendors/Utils";
import { success, unauthorized } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"


export  class AdminSignInController extends MainController {
    constructor(
        private readonly adminsRepository: DatabaseAdapter,
        private readonly encrypter: Encrypter,
        private readonly hasher: Hasher
    ){
        super(AccessType.PUBLIC, {
            username: { type: "string", label:"Nome de Usuario" },
            password: { type: "string", label: "Senha" }
        })
    }
    async handler(request: Request): Promise<Response> {

        const { username, password } = request.body

        var exists = await this.adminsRepository.find({ username: username })
        if(!exists) return unauthorized()

        const isValid = await this.hasher.compare(password, exists.password)
        if(!isValid) return unauthorized()

        const token = await this.encrypter.sign(exists.id)
        return success({ accessToken: token })
    }

}


export class AuthAdminController extends MainController {

    constructor(  ){ super(AccessType.ADMIN) }

    async handler(request: Request): Promise<Response> {

        const { user } = request
        if(!user) return unauthorized()
        
        delete user.password
        return success(user)
    }
}