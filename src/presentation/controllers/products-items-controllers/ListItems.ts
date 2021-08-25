import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { ProductItem } from "../../../domain/entities/ProductItem"
import { mapItems } from './serializers/FullItemView'
import { Knex } from "knex"
import { query } from "express"


export interface ItemListFeed {
    total: number,
    subTotal: number,
    data: ProductItem[],
}


export class FilterListItem extends MainController{
    constructor(  
        private readonly itemsRepository: DatabaseAdapter,
        private readonly knexConnection: Knex,
        private readonly serializer: any
    ){  super(AccessType.ADMIN) }

    async findproductsInside(item_id: string){
        if(!item_id) return []
        const result = await this.knexConnection('products').where({"item_id": item_id}).select("*")
        return result   
    } 

    async filterByBrands( brands: []): Promise<string[]>{
        if( brands.length === 0 ) return []

        let productsBrandsQuery = this.knexConnection('products').select(["id", 'description', 'item_id'])
        
        if(brands.length > 0) { //produtos com marca tal
            productsBrandsQuery.where((query:any) => {
                query.whereIn('products.brand_id',brands)
            })
        }

        let matchedBrands = await productsBrandsQuery
        let itemIds = matchedBrands.map(p=>(p.item_id))
        return itemIds

    }

    async findByItemsName(query:any, count_query:any, itemsName: string): Promise<void>{
   
        if(!itemsName) return

        query.andWhere( (query:any) =>{ query.where(`product_items.name`, 'ilike', `%${itemsName}%`) })   
        count_query.andWhere( (query:any) =>{  query.where(`product_items.name`, 'ilike', `%${itemsName}%`) })  

    }

    async findByProductParams(query:any, count_query:any, text: string, brands:string[]): Promise<string[]>{
   
        if(!text) return 
        let productsQuery = this.knexConnection('products').select(["id", 'description', 'item_id'])

        if(brands.length > 0){
            productsQuery.whereIn('products.brand_id',brands)
        }

        productsQuery.andWhere( (query:any) =>{
            query.orWhere(`products.description`, 'ilike', `%${text}%`)
            query.orWhere(`products.ean`, 'ilike', `%${text}%`) 
        })   

        let allowedProducts = await productsQuery 
        let itemIds = allowedProducts.map(p=>(p.item_id))
        
        
        query.andWhere( (query:any) =>{
            query.whereIn(`product_items.id`,itemIds)
        })   

        count_query.andWhere( (query:any) =>{
            query.whereIn(`product_items.id`, itemIds)
        })  

        return allowedProducts.map(p=>(p.id))
    }

    async handler(request: Request): Promise<Response> {
     
        const LIMIT = 6
        const OFFSET = Number(request.query.o) || 0

        const item_name = request.query.item || '';
        const product_description = request.query.product || '';
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : []

        const result: ItemListFeed ={
            total: await this.itemsRepository.count({},'id'), 
            subTotal: 0,
            data:[]
        }

        var query = this.knexConnection('product_items').select("*").offset(OFFSET).limit(LIMIT);
        var count_query = this.knexConnection('product_items')

        var requiredProducts:string[] = []

        if(item_name){
            await this.findByItemsName(query, count_query, item_name)
        }

        if(product_description){ // werent found any product, it doesnt return the item as well
            requiredProducts = await this.findByProductParams(query, count_query, product_description, brands)
        }

        const queryResult = await query
        const count  = await count_query.count('id', {as: 'count'}).first(); 

        result.subTotal =  count ? Number(count.count) : 0
        result.data = queryResult
        


        //whether gettin the products frominside de item
        // if where giben a products_descriptionand it should use required products to filter
        
        result.data= await Promise.all(queryResult.map(async i=>{
            let products = []

            const productsquery = this.knexConnection('products').where({item_id: i.id})
            
            if(product_description){
                productsquery.andWhere(query=>{
                    query.whereIn('products.id', requiredProducts)
                })
            }
            products = await productsquery
            products = await Promise.all(products.map(p=>(this.serializer(p)))) // serializer it with date needed
            
           return { ...i, products }
        }))
        
        return success(result)
        
    }
}
/*   products.sort((a, b) => !matchedProducts.includes(a.id) ? 1 : -1)  */