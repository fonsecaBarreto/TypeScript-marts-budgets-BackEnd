"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandler = exports.AccessType = void 0;
const http_helper_1 = require("./http-helper");
var AccessType;
(function (AccessType) {
    AccessType[AccessType["PUBLIC"] = 0] = "PUBLIC";
    AccessType[AccessType["ADMIN"] = 1] = "ADMIN";
    AccessType[AccessType["MART"] = 2] = "MART";
    AccessType[AccessType["MART_OR_ADMIN"] = 3] = "MART_OR_ADMIN";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
class AuthenticationHandler {
    constructor(encrypter, adminRepository, martRepository, access) {
        this.encrypter = encrypter;
        this.adminRepository = adminRepository;
        this.martRepository = martRepository;
        this.access = access;
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
        var user;
        switch (this.access) {
            case AccessType.MART:
                {
                    user = await this.martRepository.find({ id: decoded === null || decoded === void 0 ? void 0 : decoded.id });
                }
                ;
                break;
            case AccessType.ADMIN:
                {
                    user = await this.adminRepository.find({ id: decoded === null || decoded === void 0 ? void 0 : decoded.id });
                }
                ;
                break;
            case AccessType.MART_OR_ADMIN:
                {
                    user = await this.adminRepository.find({ id: decoded === null || decoded === void 0 ? void 0 : decoded.id });
                    if (!user) {
                        user = await this.martRepository.find({ id: decoded === null || decoded === void 0 ? void 0 : decoded.id });
                    }
                }
                ;
                break;
        }
        if (!user)
            return http_helper_1.unauthorized();
        request.user = user;
        return null;
    }
}
exports.AuthenticationHandler = AuthenticationHandler;
