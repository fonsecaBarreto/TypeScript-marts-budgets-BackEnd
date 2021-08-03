
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"
import { MapCategoryTreeView, MakeCategoryTreeView } from './serializers/CategoryTreeView'

export class ListCategoriesTree extends MainController {
    constructor( private readonly categoryRepository: DatabaseAdapter,
        ){  super(AccessType.ADMIN) }

    async handler(request: Request): Promise<Response> {
        const sup =request.query.s || null
        const categories = await this.categoryRepository.list({ category_id: sup })
        return success(await MapCategoryTreeView(this.categoryRepository, categories, MakeCategoryTreeView)) 
    }
}