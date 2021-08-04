import { BrandModel, CategoryModel } from "../../../domain/entities/ProductModel";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"

export interface BrandsScrewViewModel {
    total: number,
    subTotal: number,
    data: BrandModel[]
}

export class ListBrandsScrewView extends MainController {
    constructor(  private readonly brandsRepository: DatabaseAdapter,
        ){  super(AccessType.MART_OR_ADMIN) }

        async handler(request: Request): Promise<Response> {

            const limit = 8
            const text = request.query.v || '';
            const offset = Number(request.query.o) || 0
        
            const total = await this.brandsRepository.count({},'id')
            var { queryData, queryTotal } = await this.brandsRepository.listAlike(['name'], text, {},{}, offset, limit)

        const listFeed: BrandsScrewViewModel ={
            total, 
            subTotal: queryTotal,
            data: queryData
        }

        return success(listFeed)
    }
}