import { repositories,vendors } from './depedencies'
import MakeOrder from '../../presentation/controllers/orders-controllers/CreateOrder'

const { martsRepository, productsRepository, ordersRepository } = repositories


export const makeOrder = new MakeOrder(vendors.idGenerator, ordersRepository, productsRepository, martsRepository)