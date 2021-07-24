"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class UuidAdapter {
    async generate() {
        return uuid_1.v4();
    }
}
exports.default = UuidAdapter;
