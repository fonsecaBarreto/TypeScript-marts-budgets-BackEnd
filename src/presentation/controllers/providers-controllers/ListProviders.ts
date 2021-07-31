import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { ProviderModel } from "../../../domain/entities/ProductModel"

export interface ProviderListFeed {
    total: number,
    offset: number
    data: ProviderModel[]
}

export class FilterListProvider extends MainController{
    constructor(  private readonly providersRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const text = request.query.v || '';
        const offset = Number(request.query.o) || 0

        const total = await this.providersRepository.count({},'id')
        const found = await this.providersRepository.listAlike(['name','email','phone'], text, 'created_at', offset, 2)
        const providerListFeed: ProviderListFeed ={
            total, 
            offset,
            data: found
        }
        return success(providerListFeed)
    }
}