import { Router } from "express"
import { fileRepository, vendors, repositories } from '../factories/depedencies'
import { AccessType, AuthenticationHandler } from '../../presentation/helpers/Authentication'
import { StreamControler } from '../../presentation/controllers/StreamController'
import { AuthMartController } from "../../presentation/controllers/marts-controllers/Login"

const authenticator = new AuthenticationHandler(vendors.encrypter,repositories.adminsRepository,repositories.martsRepository,AccessType.MART_OR_ADMIN)
const streamController = StreamControler(authenticator, fileRepository)

export default ( router: Router) =>{

    router.get('/files',streamController)
    
}