import { MartModel } from "../../domain/entities/MartModel";
import { AddressNotFoundError, CpfCnpjInUseError, EmailInUseError, MartNotFoundError, PhoneInUseError } from "../../domain/protocols/Errors";
import { CorporateNameInUseError, FinancialEmailInUseError } from "../../domain/protocols/Errors/MartsErrors";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { Hasher, IdGenerator } from "../../domain/vendors/Utils";
import { updateAddress } from "../../main/factories/address";
import { CreateCheckList } from "./checklist";

export namespace CreateMart {
    export type Params = {
        name: string
        email:string,
        phone: string,
        cnpj_cpf: string,
        image: string
        transfer_allowed: boolean,
        address_id:string,
        financial_email:string,
        responsible_name:string,
        corporate_name:string,
        obs:string,
        password: string,
    }
    export type UpdateParams = {
        id:string,
        name: string
        email:string,
        phone: string,
        cnpj_cpf: string,
        transfer_allowed: boolean,
        financial_email:string,
        responsible_name:string,
        corporate_name:string,
        obs:string,
    }
    export interface ICreateMart {
        update(params: CreateMart.UpdateParams): Promise<MartModel>
        execute(params: CreateMart.Params): Promise<MartModel>
        checkDuplicity(cnpj_cpf: string, email: string, phone?: string, corporate_name?:string, financial_email?:string, mart?:MartModel): Promise<void> 
    }
}

export default class CreateMart implements CreateMart.ICreateMart {

    constructor(
        private readonly martsRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
        private readonly hasher: Hasher,
        private readonly addressRepository: DatabaseAdapter,
        private readonly createCheckList: CreateCheckList
    ){}

    public async checkDuplicity(cnpj_cpf: string, email: string, phone?: string, corporate_name?:string, financial_email?:string, mart?:MartModel): Promise<void> {

        const emailExists = await this.martsRepository.find({email})
        if(emailExists) {
            if( (!mart) || mart.email !== email) throw EmailInUseError()
        }
        
        const documentExists = await this.martsRepository.find({cnpj_cpf})
        if(documentExists){ 
            if( (!mart) || mart.cnpj_cpf !== cnpj_cpf) throw CpfCnpjInUseError()
        }

        if(phone){   
            const phoneExists = await this.martsRepository.find({phone})
            if(phoneExists) {
                if( (!mart) || mart.phone !== phone) throw PhoneInUseError()
            }
        }

        if(corporate_name){
            const corporateNameExists = await this.martsRepository.find({corporate_name})
            if(corporateNameExists) {
                if( (!mart) || mart.corporate_name !== corporate_name) throw CorporateNameInUseError()
            }
        }

        if(financial_email) {
            const financialEmailExits = await this.martsRepository.find({financial_email})
            if(financialEmailExits) {
                if( (!mart) || mart.financial_email !== financial_email) throw FinancialEmailInUseError()
            }
        }
    }

    async update(params: CreateMart.UpdateParams) {

        const { id, cnpj_cpf, name, email, phone, transfer_allowed, corporate_name, financial_email, obs,responsible_name } = params

        const mart = await this.martsRepository.find({id})
        if(!mart) throw MartNotFoundError()

        await this.checkDuplicity(cnpj_cpf, email, phone, corporate_name, financial_email, mart)
    
        await this.martsRepository.update({id},{ cnpj_cpf, name, email, phone, transfer_allowed, corporate_name, financial_email, obs,responsible_name  })

        const rescued  = await this.martsRepository.find({id})
        return rescued
    
    }

    async execute(params: CreateMart.Params) {

        const { cnpj_cpf, name, email, phone, password, transfer_allowed, image, 
            obs, address_id, corporate_name, financial_email, responsible_name } = params

        const addressExits = await this.addressRepository.find({ id: address_id })
        if(!addressExits) throw AddressNotFoundError()

        const id = await this.idGenerator.generate()

        const password_hash = password ? await this.hasher.hash(password) : null

        const mart: MartModel = {
            image, transfer_allowed,
            id, cnpj_cpf, name, email, phone, password: password_hash,
            address_id, corporate_name, financial_email, responsible_name,  obs, 
        }

        await this.martsRepository.insert(mart)

        await this.createCheckList.execute({mart_id: id})

        const rescued  = await this.martsRepository.find({id})
        
        return rescued
    
    }
}