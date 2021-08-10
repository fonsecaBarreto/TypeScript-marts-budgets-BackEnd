import { Request, Response } from "../../../domain/protocols/http";
import { badRequest, success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";

import { ProviderModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { CpfCnpjInUseError, EmailInUseError, FinancialEmailInUseError, InvalidRequestBodyError, PhoneInUseError, ProviderNotFoundError } from "../../../domain/protocols/Errors";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { CnpjInUseError, CorporateNameInUseError } from "../../../domain/protocols/Errors/ProvidersErrors";
import { BodyValidator } from "../../../domain/protocols/ControllerBateries";
import CreateAddress from "../../../data/address/CreateAdress";
import { mapProviders } from './serializers/ProviderPrivateView'
export class CreateProviderController  extends MainController{
    constructor( 
        private readonly adressValidator: BodyValidator,
        private readonly createAddress: CreateAddress,
        private readonly providersRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
        private readonly serializer: any,
        schema: Record<string,any>
    ){ super(AccessType.ADMIN, schema) }

    async check(corporate_name:string, cnpj:string, email:string, phone:string, financial_email:string, provider: ProviderModel){


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

        if(financial_email) {
            const financialEmailExits = await this.providersRepository.find({financial_email})
            if(financialEmailExits) {
                if( (!provider) || provider.financial_email !== financial_email) throw FinancialEmailInUseError()
            }
        }
    }

    async handler(request: Request): Promise<Response> {

        var provider: ProviderModel;

        const provider_id = request.params.id
        const { name, email, phone, corporate_name, cnpj, obs,
            responsible_name, financial_email, address } = request.body

        if(provider_id){
            provider = await this.providersRepository.find({id: provider_id})
            if(!provider) throw ProviderNotFoundError()
        }

        await this.check( corporate_name, cnpj, email, phone, financial_email, provider)

        const id = provider_id ? provider_id : await this.idGenerator.generate() 

        if(provider_id){
            stored = await this.providersRepository.update({id},{ name, email, phone, obs,corporate_name, cnpj, responsible_name, financial_email })
        }else{  

            const errors = await this.adressValidator.validate(JSON.parse(address))
            if(errors){
                var outputErr:any= { address:{} }
                Object.keys(errors).map((e:string) =>{ outputErr.address[e]=errors[e] })
                return  badRequest(InvalidRequestBodyError(outputErr))
            }

            const storedAddress = await this.createAddress.execute(JSON.parse(address))

            const novo: ProviderModel = { id, corporate_name, cnpj, name, email, phone, obs, responsible_name, financial_email, address_id: storedAddress.id }
            stored = await this.providersRepository.insert(novo)
        }

        var stored = await this.providersRepository.find({id})
        return success(await this.serializer(stored))
    }
}

export class FindController  extends MainController{
    constructor(  
        private readonly providersRepository: DatabaseAdapter,
        private readonly serializer: any,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const id = request.params.id
        if(id){
            const result = await this.providersRepository.find({id})
            return success(await this.serializer(result))
        }else{
            const results = await this.providersRepository.list({},[],'created_at')
            return success(await mapProviders(results, this.serializer))
        }
    }
}

export class RemoveController  extends MainController{
    constructor( 
        private readonly providersRepository: DatabaseAdapter,
        private readonly addressRepository: DatabaseAdapter,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id

        const exists = await this.providersRepository.find({id})
        if(!exists) throw ProviderNotFoundError()

        if(exists.address_id){
            await this.addressRepository.remove({id: exists.address_id})
        }

        await this.providersRepository.remove({id})

        return success()
    }
}


