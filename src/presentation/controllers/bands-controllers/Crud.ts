import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { BrandModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { IdGenerator } from "../../../domain/vendors/Utils";

import { Create as CreateSchema, Update as UpdateSchema } from '../../schemas/brand-schema.json'

import { BrandNotFoundError } from "../../../domain/protocols/Errors";


export class CreateBrandController  extends MainController{
    constructor( 
        private readonly brandsRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
    ){ super(AccessType.ADMIN, CreateSchema) }


    private async checkDuplicity( name:string, brand?: BrandModel ): Promise<void> {

        const nameExists = await this.brandsRepository.find({ name })
        if(nameExists) {
            if( (!brand) || brand.name !== name) throw BrandNotFoundError()
        }

    }

    async handler(request: Request): Promise<Response> {

        const brand_id = request.params.id;
        const { name } = request.body

        if(brand_id) {
            const exists = await this.brandsRepository.find({ id: brand_id })
            if(!exists) throw BrandNotFoundError()
            await this.checkDuplicity(name, exists)
        } else {
            await this.checkDuplicity(name)
        }

        const id = brand_id ? brand_id : await this.idGenerator.generate()

        if(brand_id){
            await this.brandsRepository.update({id}, { name })
        }else{
            const brandModel: BrandModel = { id, name }
            await this.brandsRepository.insert(brandModel)
        }

        const brand = await this.brandsRepository.find({id})

        return success(brand)

    }
}

export class FindController  extends MainController{
    constructor(  
        private readonly brandsRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const id = request.params.id

        if(id){
            const brand =  await this.brandsRepository.find({id})
            return success( brand)
           
        }else{
            return success(await this.brandsRepository.list({}))
        }
    }
}

export class RemoveController  extends MainController{
    constructor(
        private readonly brandsRepository: DatabaseAdapter
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id
        
        const exists = await this.brandsRepository.find({id})
        if(!exists) throw BrandNotFoundError()

        await this.brandsRepository.remove({id})

        return success()
    }
}


