import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"
import { MapCategoryTreeView, MapCategoryListView } from './serializers/CategoryListView'

export class ListPrimaryCategories extends MainController {
    constructor(  private readonly categoryRepository: DatabaseAdapter,
        ){  super(AccessType.ADMIN) }

        async handler(request: Request): Promise<Response> {
         
            const categories = await this.categoryRepository.list({ category_id: null })
            return success(await MapCategoryListView(categories)) 
        }
}


export class ListCategoriesTree extends MainController {
    constructor(  private readonly categoryRepository: DatabaseAdapter,
        ){  super(AccessType.ADMIN) }

        async handler(request: Request): Promise<Response> {
         
            const categories = await this.categoryRepository.list({ category_id: null })
            return success(await MapCategoryTreeView(this.categoryRepository, categories)) 
        }
}