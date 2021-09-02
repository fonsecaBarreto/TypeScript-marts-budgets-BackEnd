"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.updateAddress = exports.createAddress = void 0;
const depedencies_1 = require("./depedencies");
const CreateAdress_1 = __importDefault(require("../../data/address/CreateAdress"));
const UpdateAddress_1 = __importDefault(require("../../data/address/UpdateAddress"));
const Crud_1 = require("../../presentation/controllers/address-controllers/Crud");
const { idGenerator } = depedencies_1.vendors;
const { addressRepository } = depedencies_1.repositories;
exports.createAddress = new CreateAdress_1.default(idGenerator, addressRepository);
exports.updateAddress = new UpdateAddress_1.default(addressRepository);
exports.controllers = {
    updateAddressController: new Crud_1.UpdateAddressController(exports.updateAddress)
};
