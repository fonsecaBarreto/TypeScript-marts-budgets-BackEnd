"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandler = void 0;
const http_helper_1 = require("./http-helper");
class AuthenticationHandler {
    constructor(encrypter, repository) {
        this.encrypter = encrypter;
        this.repository = repository;
        this.extractToken = (request) => {
            const { headers, query } = request;
            var token = headers.authorization ? headers.authorization.split(' ')[1] : null;
            if (!token) {
                token = query.a ? query.a + "" : null;
                if (!token)
                    return null;
            }
            return token;
        };
    }
    async execute(request) {
        const token = this.extractToken(request);
        if (!token)
            return http_helper_1.unauthorized();
        const decoded = await this.encrypter.decode(token);
        if (!decoded || !decoded.id)
            return http_helper_1.unauthorized();
        const exists = await this.repository.find({ id: decoded === null || decoded === void 0 ? void 0 : decoded.id });
        if (!exists)
            return http_helper_1.unauthorized();
        request.user = exists;
        return null;
    }
}
exports.AuthenticationHandler = AuthenticationHandler;
