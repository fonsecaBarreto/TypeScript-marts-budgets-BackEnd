import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { CategoryNotFoundError, ProductItemNotFoundError } from "../../../domain/protocols/Errors";
import { Update as UpdateSchema } from '../../schemas/item-schemas.json'

export class UpdateProductItemController  extends MainController{
    constructor( 
        private readonly itemsRepository: DatabaseAdapter,
        private readonly categoryRepository: DatabaseAdapter,
        private readonly serializer: any
    ){ super(AccessType.ADMIN, UpdateSchema) }

    async handler(request: Request): Promise<Response> {

        const { name, description, category_id } = request.body

        const id = request.params.id

        var exists  = await this.itemsRepository.find({ id })
        if(!exists) throw ProductItemNotFoundError()
    
        if(category_id){
            const categoryExists = await this.categoryRepository.find({ id: category_id })
            if(!categoryExists) throw CategoryNotFoundError()
        }

        await this.itemsRepository.update({id},{ name, category_id, description })

        var updated = await this.itemsRepository.find({id})
        return success(await this.serializer(updated))
    }
}


