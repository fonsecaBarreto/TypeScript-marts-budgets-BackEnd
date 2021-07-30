"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingFileBufferError = exports.InvalidFileBufferError = exports.ServerError = exports.DisagreementPasswordError = exports.SessionExpiredError = exports.AccessDeniedError = exports.InvalidRequestBodyError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const InvalidRequestBodyError = (errors) => (new ApplicationError_1.default("InvalidRequestBodyError", "Preencha todos os campos corretamente!", errors));
exports.InvalidRequestBodyError = InvalidRequestBodyError;
const AccessDeniedError = () => (new ApplicationError_1.default('AccessDeniedError', "Acesso negado"));
exports.AccessDeniedError = AccessDeniedError;
const SessionExpiredError = (message) => (new ApplicationError_1.default('SessionExpiredError', message || "A seção foi expirada"));
exports.SessionExpiredError = SessionExpiredError;
const DisagreementPasswordError = () => (new ApplicationError_1.default('DisagreementPasswordError', "Senha e confirmação devem ser iguais", { passwordConfirmation: 'Senha e confirmação devem ser iguais' }));
exports.DisagreementPasswordError = DisagreementPasswordError;
const ServerError = () => (new ApplicationError_1.default('ServerError', "Erro no servidor"));
exports.ServerError = ServerError;
/* files */
const InvalidFileBufferError = (types, limit, param) => {
    const list = types.map(t => (` .${t.substring(t.lastIndexOf("/") + 1, t.length)}`));
    const limitMb = (limit / (1024 * 1024)).toFixed(2);
    const message = `Somente arquivos de extesão (${list} ) e tamanho maximo de ${limitMb} Mb.`;
    return new ApplicationError_1.default('InvalidFileBufferError', message, { [param]: message });
};
exports.InvalidFileBufferError = InvalidFileBufferError;
const MissingFileBufferError = (param) => {
    return new ApplicationError_1.default('MissingFileBufferError', `Arquivo não encontrado.`, { [param]: 'Arquivo não encontrado.' });
};
exports.MissingFileBufferError = MissingFileBufferError;
