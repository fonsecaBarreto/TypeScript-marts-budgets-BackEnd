import { vendors, repositories } from './depedencies'
import { CreateProductController, FindController, RemoveController } from '../../presentation/controllers/products-controllers/Crud'
import { FilterListProduct } from '../../presentation/controllers/products-controllers/ListProducts'
import { SearchProductController } from '../../presentation/controllers/products-controllers/SearchProducts'
import { ListAllbrands } from '../../presentation/controllers/products-controllers/ListAllBrands'
import KnexAdapter from '../../libs/KnexAdapter'

import { MakeProductView } from '../../presentation/controllers/products-controllers/serializers/ProductView'
import { MakeProductSearchView } from '../../presentation/controllers/products-controllers/serializers/ProductSearchView'

const { productsRepository, categoriesRepository, brandsRepository } = repositories
const { idGenerator, fileRepository, imageTransformer } = vendors

export const serializers = { 
    productView: MakeProductView(brandsRepository, categoriesRepository),
    productSearchView: MakeProductSearchView(brandsRepository, categoriesRepository)
}

/* crud */
export const createProductController = new CreateProductController(productsRepository, categoriesRepository, brandsRepository, idGenerator, fileRepository, imageTransformer, serializers.productView)
export const updateProductController = new CreateProductController(productsRepository, categoriesRepository, brandsRepository, idGenerator, fileRepository, imageTransformer, serializers.productView)

export const findProductController = new FindController(productsRepository, serializers.productView)
export const removeProductController = new RemoveController(productsRepository, fileRepository)

export const filterListProduct = new FilterListProduct(productsRepository)

export const searchProductController = new SearchProductController(KnexAdapter.connection, serializers.productSearchView)
export const listAllbrands = new ListAllbrands(KnexAdapter.connection)


