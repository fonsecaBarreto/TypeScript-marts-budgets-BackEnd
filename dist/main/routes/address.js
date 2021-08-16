"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("../factories/address");
const { updateAddressController } = address_1.controllers;
exports.default = (router) => {
    router.put("/addresses/:id", updateAddressController.execute());
};
