import { Router } from 'express'
import { AuthMartController, MartsSignInController } from '../../presentation/controllers/marts-controllers/Login'

import { vendors, repositories } from '../factories/depedencies'


const { adminsRepository, martsRepository } = repositories
const { encrypter, hasher, idGenerator } = vendors

const martsSignInController = new MartsSignInController(martsRepository, encrypter, hasher)
const authController = new AuthMartController()


export default (router: Router) =>{
    router.post("/marts/login/signin",martsSignInController.execute() )
    router.post("/marts/login/auth",authController.execute() )
}