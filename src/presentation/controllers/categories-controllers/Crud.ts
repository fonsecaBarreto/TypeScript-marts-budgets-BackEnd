import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { CategoryModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { CategoryConflictError, CategoryNotFoundError } from "../../../domain/protocols/Errors";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { Create as CreateSchema, Update as UpdateSchema } from '../../schemas/category-Schemas.json'

export class CreateCategoryController  extends MainController{
    constructor( 
        private readonly categoryRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator
    ){ super(AccessType.ADMIN, CreateSchema) }

    async handler(request: Request): Promise<Response> {

        const { name, category_id } = request.body

        if(request.params.id){
            var exits  = await this.categoryRepository.find({id: request.params.id})
            if(!exits) throw CategoryNotFoundError()
        }

        const id = ( request.params.id ) || await this.idGenerator.generate() 

        if(category_id){
            const fatherExists = await this.categoryRepository.find({ id: category_id })
            if(!fatherExists) throw CategoryNotFoundError()

            if( fatherExists.id === id ) throw CategoryConflictError()
        }

        /* persistence */
        if(request.params.id){
            stored = await this.categoryRepository.update({id},{ name, category_id })
        }else{   
            const category: CategoryModel = { id, name, category_id }
            stored = await this.categoryRepository.insert(category)
        }

        var stored = await this.categoryRepository.find({id})
        return success(stored)
    }
}

export class FindController  extends MainController{
    constructor(  private readonly categoryRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const id = request.params.id
        if(id){
            return success(await this.categoryRepository.find({id}))
        }else{
            return success(await this.categoryRepository.list({}))
        }
    }
}

export class RemoveController  extends MainController{
    constructor( private readonly categoryRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id

        const exists = await this.categoryRepository.find({id})
        if(!exists) throw CategoryNotFoundError()

        await this.categoryRepository.remove({id})

        return success()
    }
}


