"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CnpjInUseError = exports.CorporateNameInUseError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const CorporateNameInUseError = () => (new ApplicationError_1.default('CorporateNameInUseError', "Razão social já está em uso", { 'corporate_name': "Razão social já está em uso" }));
exports.CorporateNameInUseError = CorporateNameInUseError;
const CnpjInUseError = () => (new ApplicationError_1.default('CnpjInUseError', "Já existe Conta cadastrada para esse CNPJ", { 'cnpj_cpf': "CNPJ está em uso" }));
exports.CnpjInUseError = CnpjInUseError;
