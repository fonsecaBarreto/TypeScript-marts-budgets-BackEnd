import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"
import { MartModel } from "../../../domain/entities/MartModel"
import { MartPrivateView, MapMarts} from './serializers/MartPrivateView'

export interface MartListFeed {
    total: number,
    subTotal: number,
    queries: Record<string, any>
    data: MartPrivateView[],
}

enum MartStatus {
    all,
    active,
    pending
}

export class FilterListMart extends MainController{
    constructor(  
        private readonly martsRepository: DatabaseAdapter,
        private readonly serializer: any
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const text = request.query.v || '';
        var status = (Number(request.query.s) || 0);
        status  = (status > 2 || status < 0) ? 0 : status

        const offset = Number(request.query.o) || 0
        const total = await this.martsRepository.count({},'id')
        const where = ( status === 0 || status === 1 ) ? { } : { password: null }
        const whereNot = ( status === 0 || status === 2 ) ? { } : { password: null }

        const { queryData, queryTotal } = await this.martsRepository.listAlike(['name','email','phone'], text, where,whereNot, offset, 16)

        const providerListFeed: MartListFeed ={
            total, 
            subTotal: queryTotal,
            queries: { text, status },
            data: await MapMarts(queryData, this.serializer),
        }

        return success(providerListFeed)
    }
}