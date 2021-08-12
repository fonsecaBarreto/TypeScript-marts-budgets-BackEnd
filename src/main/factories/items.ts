import { vendors, repositories } from './depedencies'
import { CreateProductItemController } from '../../presentation/controllers/products-items-controllers/CreateProductItem'
import { UpdateProductItemController } from '../../presentation/controllers/products-items-controllers/UpdateProductItem'
import { FindController, RemoveController } from '../../presentation/controllers/products-items-controllers/ReadDelete'
import { ListItemsScrewView } from '../../presentation/controllers/products-items-controllers/ItemsScrewView'
import { FilterListItem } from '../../presentation/controllers/products-items-controllers/ListItems'
import { ItemsSearchController } from '../../presentation/controllers/products-items-controllers/ItemsSearchController'
import KnexAdapter from '../../libs/KnexAdapter'
/* serialiex */
import { serializers as ProductsSerializers } from './products'
import { MakeItemView } from '../../presentation/controllers/products-items-controllers/serializers/ItemView'
import { MakeItemFullView } from '../../presentation/controllers/products-items-controllers/serializers/FullItemView'

const { itemsRepository, categoriesRepository, productsRepository } = repositories
const { idGenerator} = vendors

export const serializers = {
    itemView: MakeItemView(categoriesRepository),
    itemFullview: MakeItemFullView(categoriesRepository, productsRepository,ProductsSerializers.productView)
}
/* crud */
export const createItemController = new CreateProductItemController(itemsRepository, categoriesRepository, idGenerator, serializers.itemView)
export const updateItemController = new UpdateProductItemController(itemsRepository, categoriesRepository, serializers.itemView)

export const findItemController = new FindController(itemsRepository,serializers.itemView)
export const removeItemController = new RemoveController(itemsRepository)

export const listItemsScrewView = new ListItemsScrewView(itemsRepository)

export const filterListItem = new FilterListItem(itemsRepository, serializers.itemFullview)
export const itemsSearchController = new ItemsSearchController(KnexAdapter.connection, ProductsSerializers.productView)