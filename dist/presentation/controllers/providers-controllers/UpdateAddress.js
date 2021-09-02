"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProvidersAddressController = void 0;
const Errors_1 = require("../../../domain/protocols/Errors");
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Address_Schema_json_1 = __importDefault(require("../../schemas/Address-Schema.json"));
class UpdateProvidersAddressController extends MainController_1.MainController {
    constructor(providerRepository, createAddress, updateAddress) {
        super(MainController_1.AccessType.ADMIN, Address_Schema_json_1.default);
        this.providerRepository = providerRepository;
        this.createAddress = createAddress;
        this.updateAddress = updateAddress;
    }
    async handler(request) {
        const { params, body, query } = request;
        const provider_id = params.id;
        const { address, address_region, address_number, address_postalcode, address_city, uf, details } = body;
        const providerExists = await this.providerRepository.find({ id: provider_id });
        if (!providerExists)
            throw Errors_1.ProviderNotFoundError();
        if (providerExists.address_id) {
            let address_id = providerExists.address_id;
            const updateAddress = await this.updateAddress.execute({ id: address_id, address, address_region, address_number, address_postalcode, address_city, uf, details });
            return http_helper_1.success(updateAddress);
        }
        else {
            const newAddress = await this.createAddress.execute({ address, address_region, address_number, address_postalcode, address_city, uf, details });
            await this.providerRepository.update({ id: provider_id }, { address_id: newAddress.id });
            return http_helper_1.success(newAddress);
        }
    }
}
exports.UpdateProvidersAddressController = UpdateProvidersAddressController;
