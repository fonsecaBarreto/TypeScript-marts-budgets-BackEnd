import { vendors, repositories, fileRepository } from './depedencies'
import CreateAddress from '../../data/address/CreateAdress'
import UpdateAddress from '../../data/address/UpdateAddress'
import { UpdateAddressController } from '../../presentation/controllers/address-controllers/Crud'
import { updateBrandController } from './brands'


const { idGenerator } = vendors
const { addressRepository } = repositories

/* usecases */
export const createAddress = new CreateAddress(idGenerator, addressRepository)
export const updateAddress = new UpdateAddress(addressRepository)


/* controllers */

export const controllers = {
    updateAddressController: new UpdateAddressController(updateAddress)
    
}