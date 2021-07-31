import keys from '../config/keys'
import { vendors, repositories, fileRepository } from './depedencies'

import { CreateProviderController, FindController, RemoveController } from '../../presentation/controllers/providers-controllers/Crud'
import { FilterListProvider } from '../../presentation/controllers/providers-controllers/ListProviders'

const { providersRepository } = repositories
const { idGenerator} = vendors

/* crud */
export const createProviderController = new CreateProviderController(providersRepository, idGenerator)
export const updateProviderController = new CreateProviderController(providersRepository, idGenerator)
export const findProviderController = new FindController(providersRepository)
export const removeProviderController = new RemoveController(providersRepository)

export const filterListProvider = new FilterListProvider(providersRepository)

