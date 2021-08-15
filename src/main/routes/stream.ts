import { Router } from "express"
import { vendors, repositories } from '../factories/depedencies'
import { AccessType, AuthenticationHandler } from '../../presentation/helpers/Authentication'
import { StreamControler } from '../../presentation/controllers/StreamController'

const authenticator = new AuthenticationHandler(vendors.encrypter,repositories.adminsRepository,repositories.martsRepository,AccessType.MART_OR_ADMIN)
const streamController = StreamControler(authenticator, vendors.fileRepository)

export default ( router: Router) =>{

    router.get('/files',streamController)
    
}