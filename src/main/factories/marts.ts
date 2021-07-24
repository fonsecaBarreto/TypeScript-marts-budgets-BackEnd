import { vendors, repositories } from './depedencies'
import { AuthMartController, MartsSignInController } from '../../presentation/controllers/marts-controllers/Login'

const { martsRepository } = repositories
const { encrypter, hasher } = vendors

export const martSignInController = new MartsSignInController(martsRepository, encrypter, hasher)
export const authMartController = new AuthMartController()