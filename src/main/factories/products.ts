import { vendors, repositories } from './depedencies'
import { CreateProductController, FindController, RemoveController } from '../../presentation/controllers/products-controllers/Crud'
import { FilterListProduct } from '../../presentation/controllers/products-controllers/ListProducts'
import { MakeProductView } from '../../presentation/controllers/products-controllers/serializers/ProductView'

const { productsRepository, categoriesRepository } = repositories
const { idGenerator, fileRepository, imageTransformer } = vendors


export const serializers = { 
    productView: MakeProductView(productsRepository, categoriesRepository)
}


/* crud */
export const createProductController = new CreateProductController(productsRepository, categoriesRepository, idGenerator, fileRepository, imageTransformer, serializers.productView)
export const updateProductController = new CreateProductController(productsRepository, categoriesRepository, idGenerator, fileRepository, imageTransformer, serializers.productView)

export const findProductController = new FindController(productsRepository, serializers.productView)
export const removeProductController = new RemoveController(productsRepository, fileRepository)

export const filterListProduct = new FilterListProduct(productsRepository)


