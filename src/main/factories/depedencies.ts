import keys from '../keys'
import NodeMailerAdapter from '../../libs/NodeMailerAdapter'
import PasswordGeneratorAdapter from '../../libs/PasswordGeneratorAdapter'
import UuidAdapter from '../../libs/UuidAdapter'
import BcryptAdapter from '../../libs/BcryptAdapter'
import KnexAdapter from '../../libs/KnexAdapter'
import JsonWebTokenAdapter from '../../libs/JsonWebTokenAdapter'
import {MainController} from '../../presentation/helpers/MainController'
KnexAdapter.open(keys.node_env)

export const vendors = {
    idGenerator: new UuidAdapter(),
    passwordGenerator: new PasswordGeneratorAdapter(),
    mailer: new NodeMailerAdapter( keys.email_address, keys.email_password ),
    hasher: new BcryptAdapter(),
    encrypter: new JsonWebTokenAdapter(keys.jwt_secret)
}

export const repositories = {
    martsRepository: new KnexAdapter('marts'),
    adminsRepository: new KnexAdapter('admins'),
    categoriesRepository: new KnexAdapter('categories'),
    productsRepository: new KnexAdapter('products')
}

MainController.encrypter = vendors.encrypter
MainController.adminsRepository = repositories.adminsRepository
MainController.martsRepository = repositories.martsRepository

