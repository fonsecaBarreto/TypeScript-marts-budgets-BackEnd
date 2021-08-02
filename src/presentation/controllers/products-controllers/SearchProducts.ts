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
    async handler(request: Request): Promise<Response> {

        const c = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [request.query.c] : null

        const categories:string[] = c || []
        const brands = []
        var description = ""

        var total = 0
        var subTotal = 0
        var products: ProductModel[] = []
      
      
        console.log("categories", categories)
        const qb = (query:any) => {

            if(categories.length > 0 ) {
                query.AWhereIn('category_id', categories)
            }

            /*  */
            /* for (const col of columns) {
                query.orWhere(`${this.table}.${col}`, 'ilike', `%${alike}%`);
            } */
        }



        products = await this.knexConnection('products').where({}).andWhere(qb)
      /*   const queryData = await KnexAdapter.connection(this.table).where(where).andWhereNot(whereNot).andWhere(qb).limit(limit).offset(offset);

 */

        const result: ProductSearchView = { total, subTotal, products }



        return success(result)
     
       /*  const text = request.query.v || '';
        var category_id = request.query.c || null;

        const offset = Number(request.query.o) || 0
        const total = await this.productsRepository.count({},'id')
        const where = category_id ? { category_id } : {}

        const { queryData, queryTotal } = await this.productsRepository.listAlike(['description','ncm', 'ean', 'sku', 'brand'], text, where,{}, offset, 16)

        const providerListFeed: ProductListFeed ={
            total, 
            subTotal: queryTotal,
            queries: { text, category_id },
            data: queryData
        }

        return success(providerListFeed) */
    }
}