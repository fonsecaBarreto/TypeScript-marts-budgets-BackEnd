import path from 'path'
import keys from '../config/keys'
import NodeMailerAdapter from '../../libs/NodeMailerAdapter'
import SharpAdapter from '../../libs/Sharp/SharpAdapter'
import PasswordGeneratorAdapter from '../../libs/PasswordGeneratorAdapter'
import UuidAdapter from '../../libs/UuidAdapter'
import BcryptAdapter from '../../libs/BcryptAdapter'
import KnexAdapter from '../../libs/KnexAdapter'
import JsonWebTokenAdapter from '../../libs/JsonWebTokenAdapter'
import { MainController } from '../../presentation/helpers/MainController'
import LocalFileStorage from '../../data/LocalFileStorage'
import { Mailer } from '../../domain/vendors/Mailer'

KnexAdapter.open(keys.node_env)

class MailterStub implements Mailer {
    async send(to: string, subject: string, html: string): Promise<void> {
        return console.log(`\nEnviando email para: ${to},
        \nAssunto: ${subject}, 
        \nCorpo: ${html}`)
    }
}

export const fileRepository = new LocalFileStorage(path.join(__dirname,'..','..','..','uploads',keys.node_env))
export const sharpAdapter = new SharpAdapter()

export const vendors = {
    imageTransformer: sharpAdapter,
    fileRepository: fileRepository,
    idGenerator: new UuidAdapter(),
    passwordGenerator: new PasswordGeneratorAdapter(),
    mailer: keys.node_env === "development" ? new MailterStub() : new NodeMailerAdapter( keys.email_address, keys.email_password ),
    hasher: new BcryptAdapter(),
    encrypter: new JsonWebTokenAdapter(keys.jwt_secret)
}

export const repositories = {
    martsRepository: new KnexAdapter('marts'),
    providersRepository: new KnexAdapter('providers'),
    adminsRepository: new KnexAdapter('admins'),
    categoriesRepository: new KnexAdapter('categories'),
    productsRepository: new KnexAdapter('products'),
    ordersRepository: new KnexAdapter('orders'),
    brandsRepository: new KnexAdapter('brands'),
    addressRepository: new KnexAdapter('addresses')
}

MainController.encrypter = vendors.encrypter
MainController.martRepository = repositories.martsRepository
MainController.adminRepository = repositories.adminsRepository

