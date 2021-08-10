import keys from '../config/keys'
import { vendors, repositories, fileRepository } from './depedencies'

import { CreateProviderController, FindController, RemoveController } from '../../presentation/controllers/providers-controllers/Crud'
import { FilterListProvider } from '../../presentation/controllers/providers-controllers/ListProviders'

import { createAddress } from './address'
import AddressSchema from '../../presentation/schemas/Address-Schema.json'
import JsonValidator from '../../libs/JsonValidator'

import { MakeProviderPrivateView } from '../../presentation/controllers/providers-controllers/serializers/ProviderPrivateView'

import { Create as CreateSchema, Update as UpdateSchema } from '../../presentation/schemas/provider-schemas.json'

const addressValidator = new JsonValidator(AddressSchema)

const { providersRepository,addressRepository } = repositories
const { idGenerator} = vendors

export const serializers = { 
    providerPrivateView: MakeProviderPrivateView(addressRepository)
}

/* crud */
export const createProviderController = new CreateProviderController(addressValidator, createAddress, providersRepository, idGenerator, serializers.providerPrivateView, CreateSchema)
export const updateProviderController = new CreateProviderController(addressValidator, createAddress, providersRepository, idGenerator, serializers.providerPrivateView, UpdateSchema)
export const findProviderController = new FindController(providersRepository, serializers.providerPrivateView, )
export const removeProviderController = new RemoveController(providersRepository, addressRepository)

export const filterListProvider = new FilterListProvider(providersRepository)

