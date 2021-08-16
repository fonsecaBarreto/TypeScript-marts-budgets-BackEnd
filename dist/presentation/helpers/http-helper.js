"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = exports.forbidden = exports.unauthorized = exports.download = exports.success = exports.serverError = void 0;
const CommonErrors_1 = require("../../domain/protocols/Errors/CommonErrors");
const serverError = () => {
    return { status: 500, body: CommonErrors_1.ServerError() };
};
exports.serverError = serverError;
const success = (body) => {
    return { status: body ? 200 : 204, body };
};
exports.success = success;
const download = (stream, headers) => {
    return { status: 200, stream, headers };
};
exports.download = download;
const unauthorized = () => {
    return { status: 401, body: CommonErrors_1.AccessDeniedError() };
};
exports.unauthorized = unauthorized;
const forbidden = (error) => {
    return { status: 403, body: error };
};
exports.forbidden = forbidden;
const badRequest = (error) => {
    return { status: 400, body: error };
};
exports.badRequest = badRequest;
