import { CategoryModel } from "../../../domain/entities/ProductModel";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"

import { CategoryListView, MapCategoryListView } from './serializers/CategoryListView'

export interface CategoriesScrewViewModel {
    total: number,
    subTotal: number,
    data: CategoryListView[]
}

export class ListCategoriesScrewView extends MainController {
    constructor(  private readonly categoryRepository: DatabaseAdapter,
        ){  super(AccessType.MART_OR_ADMIN) }

        async handler(request: Request): Promise<Response> {

            const limit = 8
            const text = request.query.v || '';
            const offset = Number(request.query.o) || 0
        
            const total = await this.categoryRepository.count({},'id')
            var { queryData, queryTotal } = await this.categoryRepository.listAlike(['name'], text, {},{}, offset, limit)

        const listFeed: CategoriesScrewViewModel ={
            total, 
            subTotal: queryTotal,
            data: await MapCategoryListView(this.categoryRepository,queryData)
        }

        return success(listFeed)
    }
}