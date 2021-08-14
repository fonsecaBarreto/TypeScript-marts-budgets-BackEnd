import CreateAddress from "../../../data/address/CreateAdress";
import UpdateAddress from "../../../data/address/UpdateAddress";
import { ProviderNotFoundError } from "../../../domain/protocols/Errors";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import AddressSchema from '../../schemas/Address-Schema.json'

export class UpdateProvidersAddressController extends MainController {

    // This Controller will update providers address by its id or create one if it doesnt exists
    // Lucas Fonseca 

    constructor( 
        private readonly providerRepository: DatabaseAdapter,
        private readonly createAddress: CreateAddress,
        private readonly updateAddress: UpdateAddress
    ){ super(AccessType.ADMIN, AddressSchema) }

    async handler(request: Request): Promise<Response> {
        const { params, body, query } = request

        const provider_id = params.id

        const { address, address_region, address_number, address_postalcode, address_city, uf, details } = body

        const providerExists = await this.providerRepository.find({id: provider_id})
        if(!providerExists) throw ProviderNotFoundError() 

        if(providerExists.address_id) { //se ja existe um endereço, atualiza-lo
            let address_id = providerExists.address_id
            const updateAddress = await this.updateAddress.execute({ id: address_id, address, address_region, address_number, address_postalcode, address_city, uf, details})
            return success(updateAddress)
        
        } else{ // do contratio create um novo
            const newAddress = await this.createAddress.execute({address, address_region, address_number, address_postalcode, address_city, uf, details})
            await this.providerRepository.update({id: provider_id},{address_id: newAddress.id})
            return success(newAddress)
        }

    }
    
}