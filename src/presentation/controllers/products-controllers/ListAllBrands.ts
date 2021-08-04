import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { ProductModel } from "../../../domain/entities/ProductModel"
import { Knex } from "knex"

export class ListAllbrands extends MainController{
    constructor(  private readonly knexConnection: Knex
    ){  super(AccessType.MART_OR_ADMIN) }
    async handler(request: Request): Promise<Response> {
     /* 
        const brands = await this.knexConnection('products').distinct('brand').select("brand")
        if(brands.length === 0) success(brands)
 */
        const brands = await this.knexConnection('brands').select().where({})
        if(brands.length === 0) success(brands)

        
        return success(brands)
    }
}