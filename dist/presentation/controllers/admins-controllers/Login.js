"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminController = exports.AdminSignInController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class AdminSignInController extends MainController_1.MainController {
    constructor(adminsRepository, encrypter, hasher) {
        super(MainController_1.AccessType.PUBLIC, {
            username: { type: "string", label: "Nome de Usuario" },
            password: { type: "string", label: "Senha" }
        });
        this.adminsRepository = adminsRepository;
        this.encrypter = encrypter;
        this.hasher = hasher;
    }
    async handler(request) {
        console.log("singin request");
        const { username, password } = request.body;
        var exists = await this.adminsRepository.find({ username: username });
        if (!exists)
            return http_helper_1.unauthorized();
        const isValid = await this.hasher.compare(password, exists.password);
        if (!isValid)
            return http_helper_1.unauthorized();
        const token = await this.encrypter.sign(exists.id, Math.floor(Date.now() / 1000) + (6004800));
        return http_helper_1.success({ accessToken: token });
    }
}
exports.AdminSignInController = AdminSignInController;
class AuthAdminController extends MainController_1.MainController {
    constructor() { super(MainController_1.AccessType.ADMIN); }
    async handler(request) {
        const { user } = request;
        if (!user)
            return http_helper_1.unauthorized();
        delete user.password;
        return http_helper_1.success(user);
    }
}
exports.AuthAdminController = AuthAdminController;
