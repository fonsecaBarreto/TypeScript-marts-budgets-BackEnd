import { vendors, repositories, fileRepository } from './depedencies'
import CreateMart from '../../data/mart/CreateMart'
import { MartApp } from '../../data/mart/MartApp'
import { AuthMartController, MartsSignInController } from '../../presentation/controllers/marts-controllers/Login'
import { CreateMartController, UpdateMartController, FindController, RemoveController} from '../../presentation/controllers/marts-controllers/Crud'
import { SignUpMartController } from '../../presentation/controllers/marts-controllers/SignUp'
import { JoinMartController } from '../../presentation/controllers/marts-controllers/Join' 
import { ResetPassword, ChangePasswordByToken } from '../../presentation/controllers/marts-controllers/ResetPassword'
import { FilterListMart } from '../../presentation/controllers/marts-controllers/ListMarts' 
import { createAnnex } from './annexs'
import { createAddress } from './address'

import AddressSchema from '../../presentation/schemas/Address-Schema.json'
import JsonValidator from '../../libs/JsonValidator'

import { MakeMartPrivateView } from '../../presentation/controllers/marts-controllers/serializers/MartPrivateView'
import keys from '../config/keys'

const addressValidator = new JsonValidator(AddressSchema)
const { martsRepository, addressRepository, martannexsRepository} = repositories
const { encrypter, hasher, idGenerator, mailer, passwordGenerator} = vendors
const createMart = new CreateMart(martsRepository, idGenerator, hasher, addressRepository)
const mrtApp = new MartApp(martsRepository)

/* serializers */

export const serializers = { 
    martPrivateView: MakeMartPrivateView(addressRepository, martannexsRepository)
}

/* Login */
export const martSignInController = new MartsSignInController(martsRepository, encrypter, hasher)
export const authMartController = new AuthMartController()
export const signUpMartController = new SignUpMartController(addressValidator, createAddress, createMart, createAnnex)
export const resetPassword = new ResetPassword(martsRepository, mailer, encrypter, keys.react_client)
export const changePasswordByToken = new ChangePasswordByToken(martsRepository, mailer, encrypter, hasher)

/* crud */
export const createMartController = new CreateMartController(addressValidator, createAddress, createMart, serializers.martPrivateView)
export const updateMartController = new UpdateMartController(createMart, serializers.martPrivateView)
export const findMartController = new FindController(mrtApp,serializers.martPrivateView)
export const removeMartController = new RemoveController(martsRepository, addressRepository,martannexsRepository, fileRepository)
export const filterListMart = new FilterListMart(martsRepository, serializers.martPrivateView)


/* patch */
export const joinMartController = new JoinMartController(martsRepository, passwordGenerator, hasher, mailer) //Admin



/* ------------------Check List */
