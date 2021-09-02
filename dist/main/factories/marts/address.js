"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.usecases = exports.validator = void 0;
const index_1 = require("../dependencies/index");
const CreateAdress_1 = __importDefault(require("../../../data/address/CreateAdress"));
const UpdateAddress_1 = __importDefault(require("../../../data/address/UpdateAddress"));
const Crud_1 = require("../../../presentation/controllers/address-controllers/Crud");
const Address_Schema_json_1 = __importDefault(require("./schemas/Address-Schema.json"));
const JsonValidator_1 = __importDefault(require("../../../libs/JsonValidator"));
const { idGenerator } = index_1.vendors;
const { addressRepository } = index_1.repositories;
exports.validator = new JsonValidator_1.default(Address_Schema_json_1.default);
exports.usecases = {
    createAddress: new CreateAdress_1.default(idGenerator, addressRepository),
    updateAddress: new UpdateAddress_1.default(addressRepository)
};
exports.controllers = {
    updateAddressController: new Crud_1.UpdateAddressController(exports.usecases.updateAddress)
};
