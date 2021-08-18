import { success } from "../helpers/http-helper";
import { Request, Response } from "../../domain/protocols/http";
import { AccessType, MainController } from "../helpers/MainController";
import { Knex } from "knex";


export type MetricsView = {
    totalMarts: number,
    totalProducts: number,
    totalProviders: number,
    totalOrders: number,
    lastMarts: any[],
    lastOrders: any[],
}

export class MetricsController extends MainController{
    constructor(
        private readonly knexConnection: Knex
     ){
        super(AccessType.ADMIN, null)
    }

    async handler(request: Request): Promise<Response> {

        var aux = await this.knexConnection('products').where({}).count('id', {as: 'count'}).first();
        var totalProducts = !aux ? 0  : Number(aux.count) 

        aux = await this.knexConnection('marts').where({}).count('id', {as: 'count'}).first();
        var totalMarts = !aux ? 0  : Number(aux.count) 

        aux = await this.knexConnection('providers').where({}).count('id', {as: 'count'}).first();
        var totalProviders = !aux ? 0  : Number(aux.count) 

        aux = await this.knexConnection('orders').where({}).count('id', {as: 'count'}).first();
        var totalOrders = !aux ? 0  : Number(aux.count) 


        var lastMarts = await this.knexConnection('marts').select(['id','name','created_at']).limit(5).orderBy('created_at', 'asc')
        var lastOrders = await this.knexConnection('orders').limit(5).orderBy('created_at', 'asc')

        if(lastOrders.length > 0 ){
            lastOrders = await Promise.all(lastOrders.map(async o=>{
                var p = await this.knexConnection('products').select(['description', 'id']).where({id: o.product_id}).first()
                var m = await this.knexConnection('marts').select(['name', 'id']).where({id: o.mart_id}).first()
     
                var product = p && { label: p.description, value: p.id }
                var mart = m && { label: m.name, value: p.id }
                

                return { ...o, product, mart}
            }))
        }

        const result: MetricsView =  {
            totalMarts,
            totalProducts,
            totalProviders,
            totalOrders,
            lastMarts,
            lastOrders
        }

        return success(result)

    }
}