import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import knex, { Knex } from "knex"
import { OrderModel } from "../../../domain/entities/OrderModel"
import { ProductModel } from "../../../domain/entities/ProductModel"

export class ListOrdersLatest extends MainController{

    constructor(  
        private readonly knexConnection: Knex,
        private readonly orderSerializer: any,
        private readonly productSerializer: any,
    ){  super(AccessType.MART) }

 
    async handler(request: Request): Promise<Response> {

        const { user } = request
        const orders = await this.knexConnection('orders').where({mart_id: user.id}).limit(12).orderBy('created_at','desc')

        const serialized=  await Promise.all(orders.map( async(j,i)=>{
            const os = await this.orderSerializer(j)
            var product = await this.productSerializer(os.product)
            return { ...os, product}
        }))

    

        return success(serialized)
    }
}

//