"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpEmailHook = void 0;
const keys_1 = __importDefault(require("../../config/keys"));
const index_1 = require("../../../presentation/controllers/marts-controllers/emailhooks/index");
const dependencies_1 = require("../dependencies");
exports.signUpEmailHook = new index_1.SignUpEmailHook(dependencies_1.vendors.mailer, keys_1.default.hook_email, keys_1.default.react_client);
