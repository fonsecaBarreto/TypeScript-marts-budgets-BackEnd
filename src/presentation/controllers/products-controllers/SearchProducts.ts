import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { ProductModel } from "../../../domain/entities/ProductModel"
import { Knex } from "knex"

export interface ProductSearchView{
    total: number,
    subTotal: number,
    products: ProductModel[], 
}

export class SearchProductController extends MainController{
    constructor( 
         private readonly knexConnection: Knex
    ){  super(AccessType.MART) }


    async getCategoriesChilds(category_id: string){

        var childs = await this.knexConnection('categories').where({"category_id": category_id}).select(["id"])
        await Promise.all(childs.map(async ch=>{
            let grandsons = await this.getCategoriesChilds(ch.id)
            childs = [ ...childs, ...grandsons]
        }))
        return  childs
    }

    async handleCategories(query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, categories: string[]): Promise<void>{
        if(categories.length == 0 ) return
      
        await Promise.all(categories.map( async (c_id: string)=>{  //look for categories childs
            const childs = await this.getCategoriesChilds(c_id)
            categories = [ ...categories, ...childs.map(child=>child.id)]
        }))

        query.whereIn('category_id', categories) 
        count_query.whereIn('category_id', categories)   
    }

    async handleBrands (query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, brands: string[]): Promise<void>{
        if(brands.length == 0 ) return

        query.whereIn('brand', brands) 
        count_query.whereIn('brand', brands)   
    }

    async handleDescriptionLike(query: Knex.QueryBuilder, count_query:Knex.QueryBuilder, description:string): Promise<void> {
 
        query.andWhere(`products.description`, 'ilike', `%${description}%`)
        count_query.andWhere(`products.description`, 'ilike', `%${description}%`)
    }

    async handler(request: Request): Promise<Response> {

        const description = request.query.v || '';
        var categories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [ request.query.c ] : []
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : []
        const offset = Number(request.query.o) || 0

        const limit = 4
        var total = 0
        var subTotal = 0
        var products: ProductModel[] = []
      
        /* Count all */
        const totalOfProfucts = await this.knexConnection('products').count('id', {as: 'count'}).first();
        total = totalOfProfucts ? Number(totalOfProfucts.count) : 0
       
        /* Create query */
        var query = this.knexConnection('products').select('*').offset(offset).limit(limit);
        var count_query = this.knexConnection('products')

        await this.handleCategories(query, count_query, categories) // insure all categories childs are included
        await this.handleBrands(query, count_query, brands)
        await this.handleDescriptionLike(query, count_query, description)
        count_query.count('id', {as: 'count'}).first(); 

        var result: ProductSearchView = { total, subTotal, products }

        const resulta = await Promise.all([
            
            count_query.then((count:any)=> { result.subTotal = count ? Number(count.count) : 0 } ),
        
            query.then(products=>{
                products = products.map(p=>({description: p.description, category_id: p.category_id, brand: p.brand}))
                result.products = products
            })
            
        ])

        console.log(resulta)

        return success(result)

 
    }
}