"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class JsonWebTokenAdapter {
    constructor(secret) {
        this.secret = secret;
    }
    async sign(id, exp) {
        const token = await jsonwebtoken_1.sign({ id, exp: exp || Math.floor(Date.now() / 1000) + 6004800 }, this.secret);
        return token;
    }
    async decode(token) {
        var decoded = await jsonwebtoken_1.verify(token, this.secret);
        return decoded;
    }
}
exports.default = JsonWebTokenAdapter;
