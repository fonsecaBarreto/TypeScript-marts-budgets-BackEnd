import { vendors, repositories } from './depedencies'
import { FindController, RemoveController } from '../../presentation/controllers/products-controllers/ReadDelete'
import { CreateProductController } from '../../presentation/controllers/products-controllers/CreateProduct'
import { UpdateProductController } from '../../presentation/controllers/products-controllers/UpdateProduct'
import { FilterListProduct } from '../../presentation/controllers/products-controllers/ListProducts'
import { SearchProductController } from '../../presentation/controllers/products-controllers/SearchProducts'
import KnexAdapter from '../../libs/KnexAdapter'

import { MakeProductView } from '../../presentation/controllers/products-controllers/serializers/ProductView'
import { MakeProductSearchView } from '../../presentation/controllers/products-controllers/serializers/ProductSearchView'

const { productsRepository, itemsRepository, brandsRepository } = repositories
const { idGenerator, fileRepository, imageTransformer } = vendors

export const serializers = { 
    productView: MakeProductView(brandsRepository, itemsRepository),
    productSearchView: MakeProductSearchView(brandsRepository, itemsRepository) //outdated
}

/* crud */
export const createProductController = new CreateProductController(productsRepository, itemsRepository, brandsRepository, idGenerator, fileRepository, imageTransformer, serializers.productView)
export const updateProductController = new UpdateProductController(productsRepository, itemsRepository, brandsRepository, fileRepository, imageTransformer, serializers.productView)

export const findProductController = new FindController(productsRepository, serializers.productView)
export const removeProductController = new RemoveController(productsRepository, fileRepository)

export const filterListProduct = new FilterListProduct(productsRepository)

export const searchProductController = new SearchProductController(KnexAdapter.connection, serializers.productSearchView) //outdated



