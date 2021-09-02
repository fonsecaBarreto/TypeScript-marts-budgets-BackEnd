"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailValidator = __importStar(require("email-validator"));
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const makeMissingMessage = (field, missingMessage) => {
    return missingMessage || `Campo '${field}' é obrigatório`;
};
const makeInvalidMessage = (field, invalidMessage) => {
    return invalidMessage || `Campo '${field}' contem valor inválido `;
};
class JsonValidator {
    constructor(schema) {
        this.schema = schema;
    }
    async validate(body) {
        this.sanitize(body);
        var params = {};
        Object.keys(this.schema).map(field => {
            const { type, size, optional, label, missingMessage, invalidMessage } = this.schema[field];
            const value = body[field];
            if (type === "any")
                return;
            if (value === null) {
                if (optional === true)
                    return;
                return params[field] = makeMissingMessage(label || field, missingMessage);
            }
            let IsTypeValid = this.checkType(value, type);
            if (IsTypeValid === false)
                return params[field] = makeInvalidMessage(label || field, invalidMessage);
        });
        return Object.keys(params).length == 0 ? null : params;
    }
    sanitize(body) {
        Object.keys(body).map(param => {
            if (!this.schema[param]) {
                delete body[param];
            }
        });
        var initialBody = { ...body };
        Object.keys(this.schema).forEach(field => {
            const { type } = this.schema[field];
            var value = initialBody[field];
            var final_value = (value === undefined || value === "") ? null : value;
            if (final_value == null)
                return body[field] = null;
            switch (type) {
                case "cep":
                    final_value = (value + "").replace(/[^\d]+/g, '');
                    break;
                case "cnpj/cpf":
                    final_value = (value + "").replace(/[^\d]+/g, '');
                    break;
                case "phone":
                    final_value = (value + "").replace(/[^\d]+/g, '');
                    break;
                case "number":
                    {
                        if (!isNaN(value))
                            final_value = Number(value);
                    }
                    ;
                    break;
                case "date":
                    if (!isNaN(Date.parse(value)))
                        final_value = new Date(value);
                    break;
                case "boolean":
                    final_value = JSON.parse(value);
                    break;
            }
            return body[field] = final_value;
        });
    }
    checkType(value, type) {
        var isValid = true;
        switch (type) {
            case "json":
                {
                    try {
                        JSON.parse(value);
                        isValid = true;
                    }
                    catch (e) {
                        isValid = false;
                    }
                }
                ;
                break;
            case "cep":
                {
                    isValid = true;
                }
                ;
                break;
            case "cnpj/cpf":
                {
                    try {
                        var ok = cpf_cnpj_validator_1.cpf.isValid(value);
                        if (ok === false) {
                            ok = cpf_cnpj_validator_1.cnpj.isValid(value);
                        }
                        if (ok === false)
                            isValid = false;
                    }
                    catch (err) {
                        isValid = false;
                    }
                }
                ;
                break;
            case "phone":
                {
                    if (isNaN(value))
                        isValid = false;
                    if (value.length < 10 || value.length > 14) {
                        isValid = false;
                    }
                }
                ;
                break;
            case "date":
                if (!(value instanceof Date))
                    isValid = false;
                break;
            case "email":
                try {
                    const isEmailValid = emailValidator.validate(value);
                    if (isEmailValid === false)
                        isValid = false;
                }
                catch (err) {
                    isValid = false;
                }
                break;
            case "array":
                if (Array.isArray(value) === false)
                    isValid = false;
                break;
            default:
                if (type !== typeof value)
                    isValid = false;
                break;
        }
        return isValid;
    }
}
exports.default = JsonValidator;
