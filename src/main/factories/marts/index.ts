import keys from '../../config/keys'
import { vendors, repositories } from '../dependencies/index'
import { usecases as AddressUseCases, validator as addressValidator } from './address'
import { usecases as annexsUseCases } from './annexs'
import { usecases as checkListUseCases } from './checkList'

import CreateMart from '../../../data/mart/CreateMart'
import FindMart from '../../../data/mart/FindMart'

import { MakeMartPrivateView } from '../../../presentation/controllers/marts-controllers/serializers/MartPrivateView'
import { AuthMartController, MartsSignInController } from '../../../presentation/controllers/marts-controllers/Login'
import { ResetPassword, ChangePasswordByToken } from '../../../presentation/controllers/marts-controllers/ResetPassword'
import { CreateMartController, UpdateMartController, FindController, RemoveController} from '../../../presentation/controllers/marts-controllers/Crud'
import { SignUpMartController } from '../../../presentation/controllers/marts-controllers/SignUp'
import { JoinMartController } from '../../../presentation/controllers/marts-controllers/Join' 
import { FilterListMart } from '../../../presentation/controllers/marts-controllers/ListMarts' 

/* dependencies */
const { idGenerator, hasher, encrypter, mailer, fileRepository, passwordGenerator  } = vendors
const { martsRepository, addressRepository, martannexsRepository, martsChecklistsRepository } = repositories
/* instaces */
export const createMart = new CreateMart(martsRepository, idGenerator, hasher, addressRepository, checkListUseCases.createCheckList)
export const findMart = new FindMart(martsRepository)

/* Controllers */
export const serializers = { 
    martPrivateView: MakeMartPrivateView(addressRepository, martannexsRepository, martsChecklistsRepository)
}

export const controllers = {
    
    filterList: new FilterListMart(martsRepository, serializers.martPrivateView),
    join: new JoinMartController(martsRepository, passwordGenerator, hasher, mailer), 
    
    crud: {
        create: new CreateMartController(addressValidator, AddressUseCases.createAddress, createMart, serializers.martPrivateView),
        find: new FindController(findMart,serializers.martPrivateView),
        update: new UpdateMartController(createMart, serializers.martPrivateView),
        remove:new RemoveController(martsRepository, addressRepository,martannexsRepository, fileRepository),
    },
    
    login:{
        signup: new SignUpMartController(addressValidator, AddressUseCases.createAddress, createMart, annexsUseCases.createAnnex),
        signin: new MartsSignInController(martsRepository, encrypter, hasher),
        auth: new AuthMartController(checkListUseCases.updateCheckList, serializers.martPrivateView),
        resetPassword: new ResetPassword(martsRepository, mailer, encrypter, keys.react_client),
        changePasswordByToken: new ChangePasswordByToken(martsRepository, mailer, encrypter, hasher),
    }
}

