import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { Create as CreateSchema, Update as UpdateSchema } from '../../schemas/provider-schemas.json'
import { ProviderModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { CpfCnpjInUseError, EmailInUseError, PhoneInUseError, ProviderNotFoundError } from "../../../domain/protocols/Errors";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { CnpjInUseError, CorporateNameInUseError } from "../../../domain/protocols/Errors/ProvidersErrors";

export class CreateProviderController  extends MainController{
    constructor( 
        private readonly providersRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator
    ){ super(AccessType.ADMIN, CreateSchema) }

    async check(corporate_name:string, cnpj:string, email:string, phone:string, provider: ProviderModel){


        const cNameExists = await this.providersRepository.find({corporate_name})
        if(cNameExists){  
            if( !provider || ( provider?.corporate_name !== corporate_name)){
                throw CorporateNameInUseError()
            }
        }

        const cnpjExists = await this.providersRepository.find({cnpj})
        if(cnpjExists){  
            if( !provider || ( provider?.cnpj !== cnpj)){
                throw CnpjInUseError()
            }
        }

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

        const provider_id = request.params.id
        const { name, email, phone, corporate_name, cnpj, obs } = request.body

        if(provider_id){
            provider = await this.providersRepository.find({id: provider_id})
            if(!provider) throw ProviderNotFoundError()
        }

        await this.check( corporate_name, cnpj, email, phone, provider)

        const id = provider_id ? provider_id : await this.idGenerator.generate() 

        if(provider_id){
            stored = await this.providersRepository.update({id},{ name, email, phone, obs,corporate_name, cnpj })
        }else{   
            const novo: ProviderModel = { id, corporate_name, cnpj, name, email, phone, obs }
            stored = await this.providersRepository.insert(novo)
        }

        var stored = await this.providersRepository.find({id})
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
            return success(await this.providersRepository.list({},[],'created_at'))
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


