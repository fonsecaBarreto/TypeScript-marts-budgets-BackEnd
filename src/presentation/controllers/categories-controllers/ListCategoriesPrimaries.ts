import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { AccessType, MainController } from "../../helpers/MainController";
import { Request, Response } from '../../../domain/protocols/http'
import { success } from "../../helpers/http-helper";
import { MapCategoryListView } from './serializers/CategoryListView'

export class ListCategoriePrimaries extends MainController {
    constructor(  
        private readonly categoryRepository: DatabaseAdapter)
    { super(AccessType.MART_OR_ADMIN) }

    async handler(request: Request): Promise<Response> {
        const primaries = await this.categoryRepository.list({category_id: null})
        return success(await MapCategoryListView( this.categoryRepository, primaries))
    }
    
}