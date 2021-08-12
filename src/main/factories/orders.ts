import { repositories,vendors } from './depedencies'
import MakeOrder from '../../presentation/controllers/orders-controllers/CreateOrder'
import { ListOrdersByFilter } from '../../presentation/controllers/orders-controllers/ListOrdersByFilter'

import KnexAdapter from '../../libs/KnexAdapter'
const { martsRepository, productsRepository, ordersRepository } = repositories

export const makeOrder = new MakeOrder(vendors.idGenerator, ordersRepository, productsRepository, martsRepository)
export const listOrdersByFilter = new ListOrdersByFilter(KnexAdapter.connection)