import { repositories,vendors } from './depedencies'
import MakeOrder from '../../presentation/controllers/orders-controllers/CreateOrder'
import { ListOrdersByFilter } from '../../presentation/controllers/orders-controllers/ListOrdersByFilter'
import { MakeOrderView } from '../../presentation/controllers/orders-controllers/serializers/OrderView'

import KnexAdapter from '../../libs/KnexAdapter'

import { serializers as productsSerializers } from './products'
const { martsRepository, productsRepository, ordersRepository } = repositories


export const serializers = { 
    orderView: MakeOrderView(martsRepository),
 
}




export const makeOrder = new MakeOrder(vendors.idGenerator, ordersRepository, productsRepository, martsRepository)
export const listOrdersByFilter = new ListOrdersByFilter(KnexAdapter.connection, productsSerializers.productView, serializers.orderView)