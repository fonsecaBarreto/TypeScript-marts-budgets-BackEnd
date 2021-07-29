import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { Create as CreateSchema, Update as UpdateSchema } from '../../schemas/provider-schemas.json'
import { ProviderModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { EmailInUseError, PhoneInUseError, ProviderNotFoundError } from "../../../domain/protocols/Errors";
import { IdGenerator } from "../../../domain/vendors/Utils";

export class CreateProviderController  extends MainController{
    constructor( 
        private readonly providersRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator
    ){ super(AccessType.ADMIN, CreateSchema) }

    async check(email:string, phone:string, provider: ProviderModel){

        const emailExists = await this.providersRepository.find({email})
        if(emailExists){  
            if( !provider || ( provider?.email !== email)){
                throw EmailInUseError()
            }
        }

        if(phone){
            const phoneExists = await this.providersRepository.find({phone})
            if(phoneExists){  
                if( !provider || ( provider?.phone !== phone)){
                    throw PhoneInUseError()
                }
            }
        }
    }

    async handler(request: Request): Promise<Response> {

        var provider: ProviderModel;

        const id = request.params.id
        const { name, email, phone } = request.body

        if(id){
            provider = await this.providersRepository.find({id})
            if(!provider) throw ProviderNotFoundError()
        }

        await this.check( email, phone, provider)

 
        var provider_id:string;
        if(id){
            stored = await this.providersRepository.update({id},{ name, email, phone })
            provider_id= id
        }else{   
            var provider_id = await this.idGenerator.generate() 
            const novo: ProviderModel = { id: provider_id, name, email, phone }
            stored = await this.providersRepository.insert(novo)
        }

        var stored = await this.providersRepository.find({id: provider_id})
        return success(stored)
    }
}

export class FindController  extends MainController{
    constructor(  private readonly providersRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const id = request.params.id
        if(id){
            return success(await this.providersRepository.find({id}))
        }else{
            return success(await this.providersRepository.list({}))
        }
    }
}

export class RemoveController  extends MainController{
    constructor( private readonly providersRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id

        const exists = await this.providersRepository.find({id})
        if(!exists) throw ProviderNotFoundError()

        await this.providersRepository.remove({id})

        return success()
    }
}


