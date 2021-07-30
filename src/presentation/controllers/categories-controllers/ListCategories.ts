import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"
import { MapCategoryTreeView, MapCategoryTreeListView } from './serializers/CategoryListView'

export class ListCategoriesTree extends MainController {
    constructor(  private readonly categoryRepository: DatabaseAdapter,
        ){  super(AccessType.ADMIN) }

        async handler(request: Request): Promise<Response> {
            const view = request.query.v
            const categories = await this.categoryRepository.list({ category_id: null })
            if(view === "list") return success(await MapCategoryTreeListView(this.categoryRepository,categories)) 
            return success(await MapCategoryTreeView(this.categoryRepository, categories, null)) 
        }
}