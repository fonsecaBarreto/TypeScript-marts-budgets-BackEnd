import { Addresses } from "../../domain/entities/Addresses"
import { AddressNotFoundError } from "../../domain/protocols/Errors"
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter"
import { IdGenerator } from "../../domain/vendors/Utils"

export namespace UpdateAddress {
    export type Params = {
        id:string, 
        address: string,
        address_region: string, 
        address_number: string, 
        address_postalcode: string, 
        address_city: string,
        uf: string 
        details:string
    }
}

export default class UpdateAddress {
    constructor(
        private readonly addressRepository: DatabaseAdapter
    ){}

    async execute(params: UpdateAddress.Params ) {


        const {id, address, address_city, address_number, address_postalcode, address_region, details, uf } = params

        const exists = await this.addressRepository.find({id})
        if(!exists) throw AddressNotFoundError()

        await this.addressRepository.update({id},{ address, address_city, address_number, address_postalcode, address_region, details, uf })

        return await this.addressRepository.find({id})
    }
}