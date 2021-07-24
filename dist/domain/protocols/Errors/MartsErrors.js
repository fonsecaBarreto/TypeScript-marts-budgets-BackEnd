"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MartAlreadyVerifiedError = exports.MartNotVerifiedError = exports.PhoneInUseError = exports.CpfCnpjInUseError = exports.EmailInUseError = exports.MartNotFoundError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const MartNotFoundError = () => (new ApplicationError_1.default('MartNotFoundError', "Não Existem Registros ", { 'crendentials': "Empresa Desconhecida." }));
exports.MartNotFoundError = MartNotFoundError;
const EmailInUseError = () => (new ApplicationError_1.default('EmailInUseError', "Email esta em uso", { 'email': "Email em uso" }));
exports.EmailInUseError = EmailInUseError;
const CpfCnpjInUseError = () => (new ApplicationError_1.default('CpfCnpjInUseError', "Já existe Estabelecimento cadastrado a esse documento", { 'cnpj_cpf': "documento em uso" }));
exports.CpfCnpjInUseError = CpfCnpjInUseError;
const PhoneInUseError = () => (new ApplicationError_1.default('PhoneInUseError', "Numero de Telefone já esta em uso", { "phone": "Numero de Telefone ja cadastrado" }));
exports.PhoneInUseError = PhoneInUseError;
const MartNotVerifiedError = () => (new ApplicationError_1.default('MartNotVerifiedError', "Aguarde a Validação da conta. Você recebera um E-mail em breve"));
exports.MartNotVerifiedError = MartNotVerifiedError;
const MartAlreadyVerifiedError = () => (new ApplicationError_1.default('MartAlreadyVerifiedError', "Conta Mercado Já foi verificado."));
exports.MartAlreadyVerifiedError = MartAlreadyVerifiedError;
