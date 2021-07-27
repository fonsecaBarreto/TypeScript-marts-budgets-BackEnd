"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MartAlreadyVerifiedError = exports.MartNotVerifiedError = exports.PhoneInUseError = exports.CpfCnpjInUseError = exports.EmailInUseError = exports.MartNotFoundError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const MartNotFoundError = () => (new ApplicationError_1.default('MartNotFoundError', "Não há registros em nosso sistema", { 'credentials': "Empresa Desconhecida." }));
exports.MartNotFoundError = MartNotFoundError;
const EmailInUseError = () => (new ApplicationError_1.default('EmailInUseError', "O email que você inseriu está em uso", { 'email': "Email está em uso" }));
exports.EmailInUseError = EmailInUseError;
const CpfCnpjInUseError = () => (new ApplicationError_1.default('CpfCnpjInUseError', "Já existe Conta cadastrado a esse documento", { 'cnpj_cpf': "documento em uso" }));
exports.CpfCnpjInUseError = CpfCnpjInUseError;
const PhoneInUseError = () => (new ApplicationError_1.default('PhoneInUseError', "Numero de Telefone já está em uso", { "phone": "Numero de Telefone já cadastrado" }));
exports.PhoneInUseError = PhoneInUseError;
const MartNotVerifiedError = () => (new ApplicationError_1.default('MartNotVerifiedError', "Aguarde a Validação da conta. Você recebera um E-mail em breve"));
exports.MartNotVerifiedError = MartNotVerifiedError;
const MartAlreadyVerifiedError = () => (new ApplicationError_1.default('MartAlreadyVerifiedError', "Conta Mercado Já foi verificado."));
exports.MartAlreadyVerifiedError = MartAlreadyVerifiedError;
