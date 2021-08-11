import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { ProductModel } from "../../../domain/entities/ProductModel"

export interface ProductListFeed {
    total: number,
    subTotal: number,
    queries: Record<string, any>
    data: ProductModel[],
}

export class FilterListProduct extends MainController{
    constructor(  private readonly productsRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const text = request.query.v || '';
        var category_id = request.query.c || null;

        const offset = Number(request.query.o) || 0
        const total = await this.productsRepository.count({},'id')
        const where = category_id ? { category_id } : {}

        const { queryData, queryTotal } = await this.productsRepository.listAlike(['description','ncm', 'ean', 'sku'], text, where,{}, offset, 16)

        const providerListFeed: ProductListFeed ={
            total, 
            subTotal: queryTotal,
            queries: { text, category_id },
            data: queryData
        }

        return success(providerListFeed)
    }
}