import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter"
import { success } from "../helpers/http-helper"
import { Request, Response } from "../../domain/protocols/http"
import { AccessType, MainController } from "../helpers/MainController"

import { Knex } from "knex"
import { CategoryModel, ProductModel } from "../../domain/entities/ProductModel"


export interface ProductItemView {
    name: string,
    items: ProductItemView[]
    products: ProductModel[]
}

export interface ClientSearchResultView{
    total: number,
    subTotal: number,
    items: ProductItemView[]
}

export class ItemsSearchController extends MainController{
    constructor( 
         private readonly knexConnection: Knex,
    ){  super(AccessType.MART_OR_ADMIN) }

    async handleByCategoriesParents(query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, categories_parents:string[]){
        // it will add get categories by given id if a category list were provided
        if(categories_parents.length == 0 ) return
        query.whereIn('category_id', categories_parents) 
        count_query.whereIn('category_id', categories_parents)   
    }

    async handleCategoryNameLike(query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, category_name:string): Promise<void> {
        // it will look for on names of categories with category_name:string content inside
        if(!category_name) return 
        query.andWhere(`categories.name`, 'ilike', `%${category_name}%`)
        count_query.andWhere(`categories.name`, 'ilike', `%${category_name}%`)
    }


    async findAllProductsInside(category_id: string){
        if(!category_id) return []
        const result = await this.knexConnection('products').where({"category_id": category_id}).select("*")
        return result
    }

    async handler(request: Request): Promise<Response> {

        const category_name = request.query.v || '';
        var parentCategories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [ request.query.c ] : []
     /*    var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : [] */
        const offset = Number(request.query.o) || 0

        const LIMIT = 20
        const OFFSET = offset

        var result: ClientSearchResultView = { 
            total: 0,
            subTotal: 0, 
            items: [] as ProductItemView[] 
        }

        /* Count all */
        const totalOfITems = await this.knexConnection('categories').whereNot({ category_id: null }).count('id', {as: 'count'}).first();
        result.total = totalOfITems ? Number(totalOfITems.count) : 0
       
        /* Create query */
        var query = this.knexConnection('categories').select(['id','name','category_id']).whereNot({ category_id: null }).offset(OFFSET).limit(LIMIT);
        var count_query = this.knexConnection('categories').whereNot({ category_id: null })

        await this.handleByCategoriesParents(query, count_query, parentCategories) 
        await this.handleCategoryNameLike(query, count_query, category_name) 

        count_query.count('id', {as: 'count'}).first(); 
      
        await Promise.all([
            count_query.then((count:any)=> { 
                result.subTotal =  count ? Number(count.count) : 0
             }),
        
            query.then( async (items) => { result.items = items })
        ])

        //Find all categories inside categories listed
        if(result.items?.length > 0 ){
            result.items = await Promise.all(result.items.map( async (c: any )=>{  
                const productList = await this.findAllProductsInside(c.id)
                const categoriesTree = await this.getCategoriesChilds(c.id)
                
                c.items = categoriesTree
                c.products = productList
                
                if(c.items.length > 0 || c.products.length > 0 ) return c

                result.subTotal -= 1
                return null
            }))

            result.items  = result.items.filter(c=>(c != null)) 
        }

        return success(result)

    }


    async getCategoriesChilds(category_id: string){
        
        var categoriesTree = []
        categoriesTree = await this.knexConnection('categories').where({"category_id": category_id}).select(["id","name","category_id"])
        categoriesTree = await Promise.all(categoriesTree.map(async ch=>{
            let grandsons = await this.getCategoriesChilds(ch.id)
            let grandsonsProducts = await this.findAllProductsInside(ch.id)
            ch.items = grandsons
            ch.products = grandsonsProducts

            if(ch.items.length > 0 || ch.products.length > 0 ) return ch
            return null

        }))
        return  categoriesTree.filter(c=>(c != null))
    }



    
}