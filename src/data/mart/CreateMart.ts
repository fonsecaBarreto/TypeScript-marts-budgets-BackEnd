import { MartModel } from "../../domain/entities/MartModel";
import { CpfCnpjInUseError, EmailInUseError, MartNotFoundError, PhoneInUseError } from "../../domain/protocols/Errors";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { Hasher, IdGenerator } from "../../domain/vendors/Utils";

export namespace CreateMart {
    export type Params = {
        name: string
        email:string,
        phone: string,
        cnpj_cpf: string,
        password: string,
        annex: string,
        image: string
        transfer_allowed: boolean
    }
    export type UpdateParams = {
        id:string,
        name: string
        email:string,
        phone: string,
        cnpj_cpf: string,
        annex: string,
        image: string
        transfer_allowed: boolean
    }
}

export default class CreateMart {

    constructor(
        private readonly martsRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
        private readonly hasher: Hasher 
    ){}

    private async checkDuplicity(cnpj_cpf: string, email: string, phone: string, mart?:MartModel): Promise<void> {

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
    }

    async update(params: CreateMart.UpdateParams) {

        const { id, cnpj_cpf, name, email, phone, annex, transfer_allowed,image } = params

        const mart = await this.martsRepository.find({id})
        if(!mart) throw MartNotFoundError()

        await this.checkDuplicity(cnpj_cpf, email, phone, mart)
    
        await this.martsRepository.update({id},{ cnpj_cpf, name, email, phone, annex, transfer_allowed, image })

        const rescued  = await this.martsRepository.find({id})
        return rescued
    
    }

    async execute(params: CreateMart.Params) {

        const { cnpj_cpf, name, email, phone, password, annex, transfer_allowed, image } = params

        await this.checkDuplicity(cnpj_cpf, email, phone)
        
        const id = await this.idGenerator.generate()

        const password_hash = password ? await this.hasher.hash(password) : null

        const mart: MartModel = {
            image, annex, transfer_allowed,
            id, cnpj_cpf, name, email, phone, password: password_hash
        }

        await this.martsRepository.insert(mart)

        const rescued  = await this.martsRepository.find({id})
        return rescued
    
    }
}