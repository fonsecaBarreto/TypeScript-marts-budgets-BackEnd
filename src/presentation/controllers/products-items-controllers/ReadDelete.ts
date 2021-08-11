import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { ProductItemNotFoundError } from "../../../domain/protocols/Errors";


export class FindController extends MainController{
    constructor(  
        private readonly itemsRepository: DatabaseAdapter,
        private readonly serializer: any
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id
        if(id){
            const result = await this.itemsRepository.find({id})
            return success( await this.serializer(result))
        }else{
            return success(await this.itemsRepository.list({}))
        }
    }
}

export class RemoveController  extends MainController{
    constructor( private readonly itemsRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id

        const exists = await this.itemsRepository.find({id})
        if(!exists) throw ProductItemNotFoundError()

        await this.itemsRepository.remove({id})

        return success()
    }
}


