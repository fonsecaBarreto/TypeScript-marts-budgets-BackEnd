"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationError extends Error {
    constructor(name, message, params) {
        super(message);
        this.code = "ApplicationError";
        this.message = message;
        this.name = name;
        this.params = params || {};
    }
}
exports.default = ApplicationError;
