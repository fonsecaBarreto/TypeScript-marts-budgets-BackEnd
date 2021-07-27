import { vendors, repositories, fileRepository } from './depedencies'
import CreateMart from '../../data/mart/CreateMart'
import { MartApp } from '../../data/mart/MartApp'
import { AuthMartController, MartsSignInController } from '../../presentation/controllers/marts-controllers/Login'
import { CreateMartController, UpdateMartController, FindController, RemoveController} from '../../presentation/controllers/marts-controllers/Crud'
import { SignUpMartController, UploadMartAnnexController } from '../../presentation/controllers/marts-controllers/SignUp'
import { JoinMartController } from '../../presentation/controllers/marts-controllers/Join' 
import { ResetPassword, ChangePasswordByToken } from '../../presentation/controllers/marts-controllers/ResetPassword'
import keys from '../config/keys'

const { martsRepository } = repositories
const { encrypter, hasher, idGenerator, mailer, passwordGenerator} = vendors
const createMart = new CreateMart(martsRepository, idGenerator, hasher)
const mrtApp = new MartApp(martsRepository)

/* Login */
export const martSignInController = new MartsSignInController(martsRepository, encrypter, hasher)
export const authMartController = new AuthMartController()
export const signUpMartController = new SignUpMartController(createMart, fileRepository)
export const resetPassword = new ResetPassword(martsRepository, mailer, encrypter, keys.react_client)
export const changePasswordByToken = new ChangePasswordByToken(martsRepository, mailer, encrypter, hasher)

/* crud */
export const createMartController = new CreateMartController(createMart)
export const updateMartController = new UpdateMartController(createMart)
export const findMartController = new FindController(mrtApp)
export const removeMartController = new RemoveController(mrtApp)


/* patch */
export const uploadMartAnnexController = new UploadMartAnnexController(martsRepository, fileRepository) // outdated
export const joinMartController = new JoinMartController(martsRepository, passwordGenerator, hasher, mailer) //Admin
