"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const ExpressController_1 = require("../../domain/protocols/ExpressController");
const JsonValidator_1 = __importDefault(require("../../libs/JsonValidator"));
const Authentication_1 = require("./Authentication");
/* deep */
const MultiPartContent_1 = require("./MulterAdapter/MultiPartContent");
__exportStar(require("./Authentication"), exports);
class MainController extends ExpressController_1.ExpressController {
    constructor(accessType = Authentication_1.AccessType.ADMIN, schema, contentType) {
        const bodyValidator = schema ? new JsonValidator_1.default(schema) : null;
        const userAuthentication = accessType == Authentication_1.AccessType.PUBLIC ? null :
            new Authentication_1.AuthenticationHandler(MainController.encrypter, MainController.adminRepository, MainController.martRepository, accessType);
        const contentTypeHandler = contentType != null ? new MultiPartContent_1.MultiPartContent(contentType) : null;
        super({ userAuthentication, bodyValidator, contentTypeHandler });
    }
}
exports.MainController = MainController;
