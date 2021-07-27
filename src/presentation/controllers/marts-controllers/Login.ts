import { MartNotFoundError, MartNotVerifiedError } from "../../../domain/protocols/Errors/MartsErrors";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { Encrypter } from "../../../domain/vendors/Encrypter";
import { Hasher } from "../../../domain/vendors/Utils";
import { serverError, success, unauthorized } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"
import { SignIn as SignInSchema } from '../../schemas/mart-schemas.json'

export  class MartsSignInController extends MainController {
    constructor(
        private readonly martsRepository: DatabaseAdapter,
        private readonly encrypter: Encrypter,
        public readonly hasher: Hasher
    ){
        super(AccessType.PUBLIC, SignInSchema)
    }
    async handler(request: Request): Promise<Response> {

        const { credentials, password } = request.body

        var exists = await this.martsRepository.find({ email: credentials })
        if(!exists) {
            exists = await this.martsRepository.find({ phone: credentials })
            if(!exists){
                exists = await this.martsRepository.find({ cnpj_cpf: credentials })
            }
        }

        if(!exists) throw MartNotFoundError()

        if(!exists.password) throw MartNotVerifiedError()

        const isValid = await this.hasher.compare(password, exists.password)
        if(!isValid) return unauthorized()

        const token = await this.encrypter.sign(exists.id)

        return success({ accessToken: token })
    }

}


export class AuthMartController extends MainController {

    constructor( ){ super(AccessType.MART) }

    async handler(request: Request): Promise<Response> {

        const { user } = request
        if(!user) return unauthorized()
        
        delete user.password
        return success(user)
    }
}