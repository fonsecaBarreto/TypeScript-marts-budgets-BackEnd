import { OrderModel } from "../../../domain/entities/OrderModel";
import { OrdersRepository } from "../../../domain/repositories/odersRepository";
import KnexAdapter from '../../../libs/KnexAdapter'

export class OrdersKnexPostgresRepository implements OrdersRepository {
    private readonly table:string = "orders"
    constructor( ){}
    async findLastOs(): Promise<number> {
        const lastOrder = await KnexAdapter.connection(this.table).where({}).select(['os']).orderBy('created_at',"desc").first()
        return lastOrder?.os ? Number(lastOrder.os) : 0
    }
    async insert(order:OrderModel): Promise<void> {
        const created_at = new Date()
        const updated_at = created_at
        await KnexAdapter.connection(this.table).insert({ ...order, created_at, updated_at}) 
        return 
    }
    findById(id:string): Promise<OrderModel> {
         return KnexAdapter.connection(this.table).where({id}).select().first()
    }
}