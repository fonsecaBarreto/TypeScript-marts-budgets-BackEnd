"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProvidersAddressController = exports.filterListProvider = exports.removeProviderController = exports.findProviderController = exports.updateProviderController = exports.createProviderController = exports.serializers = void 0;
const depedencies_1 = require("./depedencies");
const Crud_1 = require("../../presentation/controllers/providers-controllers/Crud");
const ListProviders_1 = require("../../presentation/controllers/providers-controllers/ListProviders");
const UpdateAddress_1 = require("../../presentation/controllers/providers-controllers/UpdateAddress");
const address_1 = require("./address");
const Address_Schema_json_1 = __importDefault(require("../../presentation/schemas/Address-Schema.json"));
const JsonValidator_1 = __importDefault(require("../../libs/JsonValidator"));
const ProviderPrivateView_1 = require("../../presentation/controllers/providers-controllers/serializers/ProviderPrivateView");
const provider_schemas_json_1 = require("../../presentation/schemas/provider-schemas.json");
const addressValidator = new JsonValidator_1.default(Address_Schema_json_1.default);
const { providersRepository, addressRepository } = depedencies_1.repositories;
const { idGenerator } = depedencies_1.vendors;
exports.serializers = {
    providerPrivateView: ProviderPrivateView_1.MakeProviderPrivateView(addressRepository)
};
/* crud */
exports.createProviderController = new Crud_1.CreateProviderController(addressValidator, address_1.createAddress, providersRepository, idGenerator, exports.serializers.providerPrivateView, provider_schemas_json_1.Create);
exports.updateProviderController = new Crud_1.CreateProviderController(addressValidator, address_1.createAddress, providersRepository, idGenerator, exports.serializers.providerPrivateView, provider_schemas_json_1.Update);
exports.findProviderController = new Crud_1.FindController(providersRepository, exports.serializers.providerPrivateView);
exports.removeProviderController = new Crud_1.RemoveController(providersRepository, addressRepository);
exports.filterListProvider = new ListProviders_1.FilterListProvider(providersRepository);
exports.updateProvidersAddressController = new UpdateAddress_1.UpdateProvidersAddressController(providersRepository, address_1.createAddress, address_1.updateAddress);
