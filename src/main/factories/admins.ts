import { vendors, repositories } from './depedencies'
import { AdminSignInController, AuthAdminController } from '../../presentation/controllers/admins-controllers/Login'

const { adminsRepository } = repositories
const { encrypter, hasher, idGenerator } = vendors

export const adminSignInController = new AdminSignInController(adminsRepository, encrypter, hasher)
export const authAdminController = new AuthAdminController()