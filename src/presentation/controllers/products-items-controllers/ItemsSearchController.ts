import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"

import { Knex } from "knex"
import { ProductItem } from "../../../domain/entities/ProductItem"
import { ProductModel } from "../../../domain/entities/ProductModel"
import products from "../../../main/routes/products"

export interface ItemClientView {
    name: string, 
    description: string,
    products: ProductModel[]
}

export interface ClientSearchResultView{
    total: number,
    subTotal: number,
    items: ItemClientView[]
}

export class ItemsSearchController extends MainController{
    constructor( 
         private readonly knexConnection: Knex,
         private readonly serializer: any
    ){  super(AccessType.MART_OR_ADMIN) }

    async handleByCategoriesParents(query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, categories:string[]){
        // it will add get categories by given id if a category list were provided
        if(categories.length == 0 ) return
        query.whereIn('category_id', categories) 
        count_query.whereIn('category_id', categories)   
    }

    async handleItemNameLike(query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, item_name:string): Promise<void> {
        // it will look for on names of categories with category_name:string content inside
        if(!item_name) return 
        query.andWhere(`product_items.name`, 'ilike', `%${item_name}%`)
        count_query.andWhere(`product_items.name`, 'ilike', `%${item_name}%`)
    }


    async findproductsInside(item_id: string, brands:string[]){
        if(!item_id) return []
        if(brands?.length > 0){
            const result = await this.knexConnection('products').whereIn('brand_id',brands).andWhere({"item_id": item_id}).select("*")
            return result
        }else{
            const result = await this.knexConnection('products').where({"item_id": item_id}).select("*")
            return result
        }
    }


    async findByProductParams(query: Knex.QueryBuilder, queryCount: Knex.QueryBuilder, productsDescription: string): Promise<string[]>{
   
        if(!productsDescription ) return []
        //get to Know all the allowed products
        let pruductsQuery = this.knexConnection('products').select(["id", 'description', 'item_id'])
 
        if(productsDescription){
            pruductsQuery.andWhere( (query:any) =>{
                query.orWhere(`products.description`, 'ilike', `%${productsDescription}%`)
                query.orWhere(`products.ean`, 'ilike', `%${productsDescription}%`) 
               /*  query.orWhere({ ean :`${productsDescription}%`}) */
            })
                
        }
           
        let requiredProducts = await pruductsQuery 

        let itemIds = requiredProducts.map(p=>(p.item_id))
        
        query.orWhereIn('product_items.id',itemIds)
        queryCount.orWhereIn('product_items.id',itemIds)

        return requiredProducts.map(p=>p.id)
        
    }

    async handler(request: Request): Promise<Response> {

        console.log("Client is search for product items")
        const text = request.query.v || '';
        var categories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [ request.query.c ] : []
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : []
        const offset = Number(request.query.o) || 0

        const LIMIT = 16
        const OFFSET = offset

        var result: ClientSearchResultView = { 
            total: 0,
            subTotal: 0, 
            items: [] as ItemClientView[]
        }
       
        const totalOfITems = await this.knexConnection('product_items').count('id', { as: 'count' }).first();
        result.total = totalOfITems ? Number(totalOfITems.count) : 0
        
        var query = this.knexConnection('product_items').select("id",'name',"description").offset(OFFSET).limit(LIMIT);
        var count_query = this.knexConnection('product_items')
        
        await this.handleByCategoriesParents(query, count_query, categories) 
        await this.handleItemNameLike(query, count_query, text)  

        const productsFound = await this.findByProductParams(query, count_query, text)
        
        count_query.count('id', {as: 'count'}).first(); 
        
        await Promise.all([
            count_query.then((count:any)=> { 
                result.subTotal =  count ? Number(count.count) : 0
            }),
            
            query.then( async (items) => { 
               
                var items_result = items.length < 0  ? [] : (
        
                    await Promise.all(items.map(async i=>{
                        let products = []
                        products = await this.findproductsInside(i.id, brands) //fill all proucts of it

                        //Se descrição do produti for encontrada na pesquisa tb, ele é levao ao topo
                        if(productsFound?.length > 0 ){
                            console.log(productsFound)
                            products.sort((a, b) => !productsFound.includes(a.id) ? 1 : -1) 
                        }

                        products = await Promise.all(products.map(p=>(this.serializer(p)))) // serializer it with date needed

                        return { ...i, products }
                    }))
            )
                        
            result.items = items_result 
    
            })
        ])
        
        return success(result)
        

    }





    
}