import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"


export class ListAllbrands extends MainController{
    constructor(  private readonly brandRepository: DatabaseAdapter
    ){  super(AccessType.MART_OR_ADMIN) }
    async handler(request: Request): Promise<Response> {

        const brands = await this.brandRepository.list({})
        if(brands.length === 0) success(brands)

        return success(brands)
    }
}