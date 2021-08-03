"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandler = exports.AccessType = void 0;
const http_helper_1 = require("./http-helper");
const Errors_1 = require("../../domain/protocols/Errors");
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
        var decoded;
        var user;
        const token = this.extractToken(request);
        if (!token)
            return http_helper_1.unauthorized();
        try {
            decoded = await this.encrypter.decode(token);
        }
        catch (err) {
            console.log(err);
            switch (err.name) {
                case "TokenExpiredError":
                    return http_helper_1.forbidden(Errors_1.SessionExpiredError());
                    break;
                default: return http_helper_1.unauthorized();
            }
        }
        if (!decoded || !decoded.id)
            return http_helper_1.unauthorized();
        if (decoded.exp) {
            console.log('*Token Gerado em', new Date(decoded.iat * 1000));
            console.log("*Token expira em", new Date(decoded.exp * 1000));
        }
        else {
            console.log("*sem tempo de expiração");
        }
        console.log('\n');
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
