import { vendors, repositories } from './depedencies'
import { FindController, RemoveController } from '../../presentation/controllers/products-controllers/ReadDelete'
import { CreateProductController } from '../../presentation/controllers/products-controllers/CreateProduct'
import { UpdateProductController } from '../../presentation/controllers/products-controllers/UpdateProduct'
import { FilterListProduct } from '../../presentation/controllers/products-controllers/ListProducts'
import { MakeProductView } from '../../presentation/controllers/products-controllers/serializers/ProductView'


const { productsRepository, itemsRepository, brandsRepository } = repositories
const { idGenerator, fileRepository, imageTransformer } = vendors

export const serializers = { 
    productView: MakeProductView(brandsRepository, itemsRepository)
}

/* crud */
export const createProductController = new CreateProductController(productsRepository, itemsRepository, brandsRepository, idGenerator, fileRepository, imageTransformer, serializers.productView)
export const updateProductController = new UpdateProductController(productsRepository, itemsRepository, brandsRepository, fileRepository, imageTransformer, serializers.productView)

export const findProductController = new FindController(productsRepository, serializers.productView)
export const removeProductController = new RemoveController(productsRepository, fileRepository)

export const filterListProduct = new FilterListProduct(productsRepository)

