import { repositories,vendors } from './depedencies'
import MakeOrder from '../../presentation/controllers/orders-controllers/CreateOrder'
import { ListOrdersByFilter } from '../../presentation/controllers/orders-controllers/ListOrdersByFilter'
import { ListOrdersLatest } from '../../presentation/controllers/orders-controllers/ListMartsLatestsOrders'
import { MakeOrderView } from '../../presentation/controllers/orders-controllers/serializers/OrderView'
import { MakeOrderProductView } from '../../presentation/controllers/orders-controllers/serializers/OrderProductView'

import KnexAdapter from '../../libs/KnexAdapter'

import { serializers as productsSerializers } from './products'
const { martsRepository, productsRepository, ordersRepository, itemsRepository } = repositories


export const serializers = { 
    orderView: MakeOrderView(martsRepository),
    orderProductView: MakeOrderProductView(martsRepository, productsRepository, itemsRepository)
}

/* export const makeOrder = new MakeOrder(vendors.idGenerator, ordersRepository, productsRepository, martsRepository, serializers.orderProductView, productsSerializers.productView)
 */
export const listOrdersByFilter = new ListOrdersByFilter(KnexAdapter.connection, productsSerializers.productView, serializers.orderView)
export const listOrdersLatest = new ListOrdersLatest(KnexAdapter.connection, serializers.orderProductView, productsSerializers.productView)