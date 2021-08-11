import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { ProductItem } from "../../../domain/entities/ProductItem"
import { mapItems } from './serializers/FullItemView'


export interface ItemListFeed {
    total: number,
    subTotal: number,
    queries: Record<string, any>
    data: ProductItem[],
}


export class FilterListItem extends MainController{
    constructor(  
        private readonly itemsRepository: DatabaseAdapter,
        private readonly serializer: any
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const text = request.query.v || '';
        const offset = Number(request.query.o) || 0
        const total = await this.itemsRepository.count({},'id')


        const { queryData, queryTotal } = await this.itemsRepository.listAlike(['name'], text, {},{}, offset, 8)

        const providerListFeed: ItemListFeed ={
            total, 
            subTotal: queryTotal,
            queries: { text },
            data: await mapItems(queryData, this.serializer) 
        }

        return success(providerListFeed)
        
    }
}