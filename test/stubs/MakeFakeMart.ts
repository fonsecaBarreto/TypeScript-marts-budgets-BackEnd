import { MartModel } from "../../src/domain/entities/MartModel"
import { cnpj } from 'cpf-cnpj-validator'
import faker from 'faker'
export const MakeFakeMart = (fields?: Partial<MartModel>): MartModel =>{
    return ({
        id: 'test_01',
        address_id: null,
        cnpj_cpf: cnpj.generate() ,
        image: null,
        corporate_name :faker.company.companyName(),
        name: "Nome test",
        email:faker.internet.email(),
        financial_email: faker.internet.email(),
        obs:"",
        password:"123456",
        phone:faker.phone.phoneNumber(),
        responsible_name:"Responsavel test mart",
        transfer_allowed:true,
        ...fields
    })
}