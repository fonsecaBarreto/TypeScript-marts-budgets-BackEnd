import { vendors, repositories } from './depedencies'
import { CreateBrandController, FindController, RemoveController } from '../../presentation/controllers/bands-controllers/Crud'
import { ListBrandsScrewView } from '../../presentation/controllers/bands-controllers/BrandsScrewView'

const { brandsRepository } = repositories
const { idGenerator } = vendors

/* crud */
export const createBrandController = new CreateBrandController(brandsRepository, idGenerator)
export const updateBrandController = new CreateBrandController(brandsRepository, idGenerator)
export const findBrandController = new FindController(brandsRepository)
export const removeBrandController = new RemoveController(brandsRepository)
export const listBrandsScrewView = new ListBrandsScrewView(brandsRepository)

