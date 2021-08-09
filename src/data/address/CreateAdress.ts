import { Addresses } from "../../domain/entities/Addresses"
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter"
import { IdGenerator } from "../../domain/vendors/Utils"

export namespace CreateAddress {
    export type CreateParams = {
        address: string,
        address_region: string, 
        address_number: string, 
        address_postalcode: string, 
        address_city: string,
        uf: string 
        details:string
    }
}

export default class CreateAddress {
    constructor(
        private readonly idGenerator: IdGenerator,
        private readonly addressRepository: DatabaseAdapter
    ){}

    async execute(params: CreateAddress.CreateParams ) {

        const { address, address_city, address_number, address_postalcode, address_region, details, uf } = params

        const id = await this.idGenerator.generate()
        const addressModel: Addresses = {
            id, address, address_city, address_number, address_postalcode, address_region, details, uf
        }

        await this.addressRepository.insert(addressModel)

        return await this.addressRepository.find({id})
    }
}