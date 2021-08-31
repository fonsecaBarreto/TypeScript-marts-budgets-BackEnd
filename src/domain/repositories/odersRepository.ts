import { OrderModel } from '../entities/OrderModel'

export interface OrdersRepository {
    insert(order: OrderModel): Promise<void>
    findLastOs(): Promise<number>
    findById(id:string): Promise<OrderModel>
}