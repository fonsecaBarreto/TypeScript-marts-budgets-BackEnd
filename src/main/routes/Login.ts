import { Router } from 'express'
import { AdminSignInController, AuthAdminController } from '../../presentation/controllers/admins-controllers/Login'

import { vendors, repositories } from '../factories/depedencies'


const { adminsRepository } = repositories
const { encrypter, hasher, idGenerator } = vendors

const adminSignInController = new AdminSignInController(adminsRepository, encrypter, hasher)
const authController = new AuthAdminController()


export default (router: Router) =>{
    router.post("/admins/login/signin",adminSignInController.execute() )
    router.post("/admins/login/auth",authController.execute() )
}