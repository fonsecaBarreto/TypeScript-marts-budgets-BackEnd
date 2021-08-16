"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Address_Schema_json_1 = __importDefault(require("../../schemas/Address-Schema.json"));
class UpdateAddressController extends MainController_1.MainController {
    constructor(updateAddress) {
        super(MainController_1.AccessType.ADMIN, Address_Schema_json_1.default);
        this.updateAddress = updateAddress;
    }
    async handler(request) {
        const address_id = request.params.id;
        const { body } = request;
        const updated = await this.updateAddress.execute({ id: address_id, ...body });
        return http_helper_1.success(updated);
    }
}
exports.UpdateAddressController = UpdateAddressController;
