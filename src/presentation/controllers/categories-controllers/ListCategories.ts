import { CategoryModel } from "../../../domain/entities/ProductModel";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"

import { CategoryListView, MapCategoryListView } from './serializers/CategoryListView'

export interface CategoryListFeed {
    total: number,
    subTotal: number,
    queries: Record<string, string>
    data: CategoryListView[],
}

export class FilterListCategories extends MainController {
    constructor(  private readonly categoryRepository: DatabaseAdapter,
        ){  super(AccessType.MART_OR_ADMIN) }

        async handler(request: Request): Promise<Response> {

            const text = request.query.v || '';
            const c = request.query.c || null;
            const offset = Number(request.query.o) || 0
        
            var where = c ? { category_id: c } : {}
            const total = await this.categoryRepository.count({},'id')
            var { queryData, queryTotal } = await this.categoryRepository.listAlike(['name'], text, where,{}, offset, 16)

        const listFeed: CategoryListFeed ={
            total, 
            subTotal: queryTotal,
            queries: {text : text},
            data: await MapCategoryListView(this.categoryRepository,queryData)
        }

        return success(listFeed)
    }
}