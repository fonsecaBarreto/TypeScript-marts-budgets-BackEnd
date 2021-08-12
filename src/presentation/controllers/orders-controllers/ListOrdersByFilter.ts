import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { OrderModel } from "../../../domain/entities/OrderModel"
import knex, { Knex } from "knex"
import { ProductModel } from "../../../domain/entities/ProductModel"
import { Console, group } from "console"
import orders from "../../../main/routes/orders"
import products from "../../../main/routes/products"

export interface OrderGroup {
    quantities: number,
    product: ProductModel,
    orders: OrderModel[]
}


export interface OrdersView {
    total: number,
    ordersTotal:  number,
    groups: OrderGroup[]
}


export class ListOrdersByFilter extends MainController{
    constructor(  
        private readonly knexConnection: Knex,
    ){  super(AccessType.ADMIN) }

    isDateValid(date_string:string): Date{
        if(!date_string) return null
        if(!isNaN(Date.parse(date_string))) {
            return new Date(date_string)
        }
        return null
    }

  

    async groupPerProduct(orders: OrderModel[]): Promise<OrderGroup[]>{
        if(!orders) return []
        var products = await Promise.all(orders.map(r=>{ 
            return r.product_id 
        }))
        products = [ ...new Set(products)]

        const groups = await Promise.all( products.map( async p =>{

            let productExists: ProductModel = await this.knexConnection('products').where({id: p}).first()
            if(!productExists) return null

            let quantities = 0
            let productsOrders = orders.filter(o=>{    
                if( o.product_id == p){
                    quantities+=o.quantity
                    return o
                }
            })

            let group: OrderGroup = {
                quantities, //aqui o somatorio das orgesn
                product: productExists,
                orders: productsOrders
            }

            return group

        }))

        return groups.filter(g=>(g != null))

    }


    findByForecast(query: Knex.QueryBuilder, queryCount: Knex.QueryBuilder,  MAX_DATE: Date): void{
        if(MAX_DATE){
            query.whereBetween('forecast', [MAX_DATE, Infinity]);
            queryCount.whereBetween('forecast', [MAX_DATE, Infinity]);
        }
    }

    async findByProductParams(query: Knex.QueryBuilder, queryCount: Knex.QueryBuilder,  productsDescription: string, brands_ids: string[]): Promise<void>{
   
            if(!productsDescription && brands_ids.length == 0 ) return
            //get to Know all the allowed products
            let pruductsQuery = this.knexConnection('products').select("id")
            
            if(productsDescription){
                pruductsQuery.andWhere(`products.description`, 'ilike', `%${productsDescription}%`)
            }
            if(brands_ids.length > 0){
                pruductsQuery.whereIn(`brand_id`, brands_ids)
            }
            
            let allowedProducts = await pruductsQuery 

            console.log(allowedProducts)
            let productsIds = allowedProducts.map(p=>(p.id))
            
            query.whereIn('orders.product_id',productsIds)
            queryCount.whereIn('orders.product_id',productsIds)
        
    }

    async handler(request: Request): Promise<Response> {
     
        const MAX_DATE = this.isDateValid(request.query.d) //Date
        var BRANDS = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : []
        const PRODUCT_DESCRIPTION = request.query.p || null // text
         
        const totalOrders = await this.knexConnection('orders').count('id', {as: 'count'}).first(); 
        const TOTAL =  totalOrders ? Number(totalOrders.count) : 0

        const query = this.knexConnection('orders').where({})
        const queryCount = this.knexConnection('orders').where({})

        await this.findByForecast(query, queryCount, MAX_DATE)

        await this.findByProductParams(query, queryCount, PRODUCT_DESCRIPTION, BRANDS)

        const result = await query   
        const count = await queryCount.count('id', {as: 'count'}).first(); 

        const orderGroups: OrderGroup[] = await this.groupPerProduct(result)

        const test: OrdersView = {
            total: TOTAL,
            ordersTotal:  count ? Number(count.count) : 0,
            groups: orderGroups
        }

        return success(test)
    }
}

//