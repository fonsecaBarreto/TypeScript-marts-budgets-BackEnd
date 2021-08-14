import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import AddressSchema from '../../schemas/Address-Schema.json'
import UpdateAddress from "../../../data/address/UpdateAddress";


export class UpdateAddressController  extends MainController{
    constructor( 
        private readonly updateAddress: UpdateAddress
    ){ super(AccessType.ADMIN, AddressSchema) }

    async handler(request: Request): Promise<Response> {
        const address_id = request.params.id
        const { body } = request
        const updated = await this.updateAddress.execute({ id: address_id, ...body })
        return success(updated)

    }
}

