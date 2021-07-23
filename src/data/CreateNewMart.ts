import { MartModel } from "../domain/entities/MartModel";
import { CpfCnpjInUseError, EmailInUseError, PhoneInUseError } from "../domain/protocols/Errors";
import { DatabaseAdapter } from "../domain/vendors/DatabaseAdapter";
import { Hasher, IdGenerator } from "../domain/vendors/Utils";


export namespace CreateNewMart {
    export type Params = {
        name: string
        email:string,
        phone: string,
        cnpj_cpf: string,
        password: string
    }
}

export default class CreateNewMart {

    constructor(
        private readonly martsRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
        private readonly hasher: Hasher 
    ){}

    private async checkDuplicity(cnpj_cpf: string, email: string, phone: string): Promise<void> {

        const emailExists = await this.martsRepository.find({email})
        if(emailExists) throw EmailInUseError()

        const documentExists = await this.martsRepository.find({cnpj_cpf})
        if(documentExists) throw CpfCnpjInUseError()

        if(phone){   
            const phoneExists = await this.martsRepository.find({phone})
            if(phoneExists) throw PhoneInUseError()
        }
    }

    async execute(params: CreateNewMart.Params) {

        const { cnpj_cpf, name, email, phone, password } = params

        await this.checkDuplicity(cnpj_cpf, email, phone)
        
        const id = await this.idGenerator.generate()

        const password_hash = await this.hasher.hash(password)

        const mart: MartModel = {
            id, cnpj_cpf, name, email, phone, password: password_hash
        }

        await this.martsRepository.insert(mart)

        const rescued  = await this.martsRepository.find({id})

        await this.mailer.send(email, "Bem-vindo Ao UnoCompras", welcomeTemplate(password))

        return Helpers.success(rescued) 
        
    }
}