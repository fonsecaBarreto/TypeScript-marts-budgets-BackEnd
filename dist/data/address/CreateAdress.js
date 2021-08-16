"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateAddress {
    constructor(idGenerator, addressRepository) {
        this.idGenerator = idGenerator;
        this.addressRepository = addressRepository;
    }
    async execute(params) {
        const { address, address_city, address_number, address_postalcode, address_region, details, uf } = params;
        const id = await this.idGenerator.generate();
        const addressModel = {
            id, address, address_city, address_number, address_postalcode, address_region, details, uf
        };
        await this.addressRepository.insert(addressModel);
        return await this.addressRepository.find({ id });
    }
}
exports.default = CreateAddress;
