import { ProductItem } from "../../../domain/entities/ProductItem";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController"

export interface ItemsScrewViewModel {
    total: number,
    subTotal: number,
    data: ProductItem[]
}

export class ListItemsScrewView extends MainController {
    constructor(  private readonly itemsRepository: DatabaseAdapter,
        ){  super(AccessType.MART_OR_ADMIN) }

        async handler(request: Request): Promise<Response> {

            const limit = 8
            const text = request.query.v || '';
            const offset = Number(request.query.o) || 0
        
            const total = await this.itemsRepository.count({},'id')
            var { queryData, queryTotal } = await this.itemsRepository.listAlike(['name'], text, {},{}, offset, limit)

        const listFeed: ItemsScrewViewModel ={
            total, 
            subTotal: queryTotal,
            data: queryData
        }

        return success(listFeed)
    }
}