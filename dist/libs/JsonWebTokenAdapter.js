"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class JsonWebTokenAdapter {
    constructor(secret) {
        this.secret = secret;
    }
    async sign(id) {
        try {
            const token = await jsonwebtoken_1.sign({ id }, this.secret);
            return token;
        }
        catch (err) {
            return null;
        }
    }
    async decode(token) {
        try {
            var decoded = await jsonwebtoken_1.verify(token, this.secret);
            return decoded;
        }
        catch (err) {
            return null;
        }
    }
}
exports.default = JsonWebTokenAdapter;
