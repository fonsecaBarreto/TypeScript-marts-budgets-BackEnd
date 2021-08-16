"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../../domain/protocols/Errors");
class UpdateAddress {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    async execute(params) {
        const { id, address, address_city, address_number, address_postalcode, address_region, details, uf } = params;
        const exists = await this.addressRepository.find({ id });
        if (!exists)
            throw Errors_1.AddressNotFoundError();
        await this.addressRepository.update({ id }, { address, address_city, address_number, address_postalcode, address_region, details, uf });
        return await this.addressRepository.find({ id });
    }
}
exports.default = UpdateAddress;
