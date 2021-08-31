import CreateOrder from '../../../data/orders/CreateOrder'
import { infra, repositories } from '../dependencies/repositories'
import { vendors } from '../dependencies/vendors'
import { MakeOrderView } from '../../../presentation/controllers/orders-controllers/serializers/OrderView'
import { MakeOrderProductView } from '../../../presentation/controllers/orders-controllers/serializers/OrderProductView'
import CreateOrderController from '../../../presentation/controllers/orders-controllers/CreateOrder'
import { serializers as productsSerializers } from '../products'

const { idGenerator } = vendors 
const { martsRepository, productsRepository, itemsRepository } = repositories

export const serializers = { 
    orderView: MakeOrderView(martsRepository),
    orderProductView: MakeOrderProductView(martsRepository, productsRepository, itemsRepository)
}

const createOrder = new CreateOrder(idGenerator, infra.ordersRepository,infra.martsRepository,infra.productsRepository)

export const controllers = {
    order: new CreateOrderController(createOrder, serializers.orderProductView, productsSerializers.productView)
}