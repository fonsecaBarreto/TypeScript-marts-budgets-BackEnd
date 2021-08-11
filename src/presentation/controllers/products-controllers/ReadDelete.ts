import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { AccessType, MainController } from "../../helpers/MainController";
import { ProductModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { IdGenerator } from "../../../domain/vendors/Utils";

import { Create as CreateSchema, Update as UpdateSchema } from '../../schemas/product-schemas.json'
import { BrandNotFoundError, CategoryNotFoundError, ProductCodeInUseError, ProductItemNotFoundError, ProductNotFoundError } from "../../../domain/protocols/Errors";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import { ImageTransformer } from "../../../domain/vendors/ImageTransformer";


export class FindController  extends MainController{
    constructor(  
        private readonly productRepository: DatabaseAdapter, 
        private readonly serializer:any,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const id = request.params.id
        if(id){
            const product =  await this.productRepository.find({id})
            return success( await this.serializer(product))
           
        }else{
            return success(await this.productRepository.list({}))
        }
    }
}

export class RemoveController  extends MainController{
    constructor(
         private readonly productRepository: DatabaseAdapter,
         private readonly fileRepository: FileRepository
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id
        
        
        const exists = await this.productRepository.find({id})
        if(!exists) throw ProductNotFoundError()

        if(exists.image){
            await this.fileRepository.remove(exists.image)
        }

        await this.productRepository.remove({id})

        return success()
    }
}


