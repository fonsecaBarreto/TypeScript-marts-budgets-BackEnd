"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = exports.AccessType = void 0;
const ExpressController_1 = require("../../domain/protocols/ExpressController");
const JsonValidator_1 = __importDefault(require("../../libs/JsonValidator"));
var AccessType;
(function (AccessType) {
    AccessType[AccessType["ADMIN"] = 0] = "ADMIN";
    AccessType[AccessType["PUBLIC"] = 1] = "PUBLIC";
    AccessType[AccessType["MART"] = 2] = "MART";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
const MultiPartContent_1 = require("./MulterAdapter/MultiPartContent");
class MainController extends ExpressController_1.ExpressController {
    constructor(accessType = AccessType.ADMIN, schema, contentType) {
        const bodyValidator = schema ? new JsonValidator_1.default(schema) : null;
        const userAuthentication = accessType === AccessType.ADMIN ? MainController.adminAuthentication :
            accessType === AccessType.MART ? MainController.martAuthentication : null;
        const contentTypeHandler = contentType != null ? new MultiPartContent_1.MultiPartContent(contentType) : null;
        super({ userAuthentication, bodyValidator, contentTypeHandler });
    }
}
exports.MainController = MainController;
