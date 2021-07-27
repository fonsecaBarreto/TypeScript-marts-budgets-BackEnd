"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMartController = exports.MartsSignInController = void 0;
const MartsErrors_1 = require("../../../domain/protocols/Errors/MartsErrors");
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const mart_schemas_json_1 = require("../../schemas/mart-schemas.json");
class MartsSignInController extends MainController_1.MainController {
    constructor(martsRepository, encrypter, hasher) {
        super(MainController_1.AccessType.PUBLIC, mart_schemas_json_1.SignIn);
        this.martsRepository = martsRepository;
        this.encrypter = encrypter;
        this.hasher = hasher;
    }
    async handler(request) {
        const { credentials, password } = request.body;
        var exists = await this.martsRepository.find({ email: credentials });
        if (!exists) {
            exists = await this.martsRepository.find({ phone: credentials });
            if (!exists) {
                exists = await this.martsRepository.find({ cnpj_cpf: credentials });
            }
        }
        if (!exists)
            throw MartsErrors_1.MartNotFoundError();
        if (!exists.password)
            throw MartsErrors_1.MartNotVerifiedError();
        const isValid = await this.hasher.compare(password, exists.password);
        if (!isValid)
            return http_helper_1.unauthorized();
        const token = await this.encrypter.sign(exists.id);
        return http_helper_1.success({ accessToken: token });
    }
}
exports.MartsSignInController = MartsSignInController;
class AuthMartController extends MainController_1.MainController {
    constructor() { super(MainController_1.AccessType.MART); }
    async handler(request) {
        const { user } = request;
        if (!user)
            return http_helper_1.unauthorized();
        delete user.password;
        return http_helper_1.success(user);
    }
}
exports.AuthMartController = AuthMartController;
