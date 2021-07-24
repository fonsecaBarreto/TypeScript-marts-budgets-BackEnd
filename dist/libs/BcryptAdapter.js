"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BcryptAdapter {
    hash(value) {
        return bcryptjs_1.default.hash(value, 12);
    }
    compare(value, hash) {
        return bcryptjs_1.default.compare(value, hash);
    }
}
exports.default = BcryptAdapter;
