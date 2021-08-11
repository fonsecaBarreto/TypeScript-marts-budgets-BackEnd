import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { CategoryNotFoundError } from "../../../domain/protocols/Errors";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { ProductItem } from "../../../domain/entities/ProductItem";

import { Create as CreateSchema } from '../../schemas/item-schemas.json'

export class CreateProductItemController  extends MainController{
    constructor( 
        private readonly itemsRepository: DatabaseAdapter,
        private readonly categoryRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
        private readonly serializer: any
    ){ super(AccessType.ADMIN, CreateSchema) }

    async handler(request: Request): Promise<Response> {

        const { name, description, category_id } = request.body

        const id = await this.idGenerator.generate() 

        if(category_id){
            const categoryExists = await this.categoryRepository.find({ id: category_id })
            if(!categoryExists) throw CategoryNotFoundError()
        }

        const item: ProductItem = { id, name, description, category_id }
        stored = await this.itemsRepository.insert(item)

        var stored = await this.itemsRepository.find({id})
        return success(await this.serializer(stored))
    }
}


