import { vendors, repositories } from '../dependencies/index'
import CreateAddress from '../../../data/address/CreateAdress'
import UpdateAddress from '../../../data/address/UpdateAddress'
import { UpdateAddressController } from '../../../presentation/controllers/address-controllers/Crud'
import AddressSchema from './schemas/Address-Schema.json'
import JsonValidator from '../../../libs/JsonValidator'

const { idGenerator } = vendors
const { addressRepository } = repositories

export const validator = new JsonValidator(AddressSchema)
/* usecases */
export const usecases = {
    createAddress: new CreateAddress(idGenerator, addressRepository),
    updateAddress: new UpdateAddress(addressRepository)
}

/* controllers */
export const controllers = {
    updateAddressController: new UpdateAddressController(usecases.updateAddress)
}