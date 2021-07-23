import { Router } from 'express'
import { AuthMartController, MartsSignInController } from '../../presentation/controllers/marts-controllers/Login'
import { CreateMartController } from '../../presentation/controllers/marts-controllers/Crud'

import { vendors, repositories } from '../factories/depedencies'


const { adminsRepository, martsRepository } = repositories
const { encrypter, hasher, idGenerator } = vendors

const martsSignInController = new MartsSignInController(martsRepository, encrypter, hasher)
const authController = new AuthMartController()

/*  */

const createController  = new CreateMartController()
export default (router: Router) =>{
    router.post("/marts/login/signin",martsSignInController.execute() )
    router.post("/marts/login/auth",authController.execute() )


    router.post('/marts', createController.execute())
}