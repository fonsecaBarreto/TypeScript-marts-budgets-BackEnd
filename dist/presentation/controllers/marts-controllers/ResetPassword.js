"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordByToken = exports.ResetPassword = void 0;
const Errors_1 = require("../../../domain/protocols/Errors");
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const mart_schemas_json_1 = require("../../schemas/mart-schemas.json");
const UnoCompras_1 = require("../../helpers/EmailLayouts/UnoCompras");
class ResetPassword extends MainController_1.MainController {
    constructor(martsRepository, mailer, encrypter, client_url) {
        super(MainController_1.AccessType.PUBLIC, mart_schemas_json_1.resetPassword);
        this.martsRepository = martsRepository;
        this.mailer = mailer;
        this.encrypter = encrypter;
        this.client_url = client_url;
    }
    async handler(request) {
        const { credentials } = request.body;
        var exists = await this.martsRepository.find({ email: credentials });
        if (!exists) {
            exists = await this.martsRepository.find({ phone: credentials });
            if (!exists) {
                exists = await this.martsRepository.find({ cnpj_cpf: credentials });
            }
        }
        if (!exists)
            throw Errors_1.MartNotFoundError();
        if (!exists.password)
            throw Errors_1.MartNotVerifiedError();
        const token = await this.encrypter.sign(exists.id, Math.floor(Date.now() / 1000) + (3600));
        this.mailer.send(exists.email, "Reset de Senha", UnoCompras_1.UnoComprasTemplate(`<div>
            <h2> Olá ${exists.name}, você solicitou a troca de senha? </h2>
            <h1></h1> <a href="${this.client_url}/change-password?v=${token}&n=${exists.name}"> Trocar Senha </a> <div>`));
        return http_helper_1.success();
    }
}
exports.ResetPassword = ResetPassword;
class ChangePasswordByToken extends MainController_1.MainController {
    constructor(martsRepository, mailer, encrypter, hasher) {
        super(MainController_1.AccessType.PUBLIC, mart_schemas_json_1.changePassword);
        this.martsRepository = martsRepository;
        this.mailer = mailer;
        this.encrypter = encrypter;
        this.hasher = hasher;
    }
    async handler(request) {
        const { query, body } = request;
        const { password, passwordConfirmation } = request.body;
        if (password !== passwordConfirmation)
            throw Errors_1.DisagreementPasswordError();
        const token = query.v;
        if (!token)
            return http_helper_1.unauthorized();
        var decoded;
        try {
            decoded = await this.encrypter.decode(token);
        }
        catch (err) {
            switch (err.name) {
                case "TokenExpiredError":
                    return http_helper_1.forbidden(Errors_1.SessionExpiredError());
                    break;
                default: return http_helper_1.unauthorized();
            }
        }
        if (!decoded)
            return http_helper_1.unauthorized();
        const mart = await this.martsRepository.find({ id: decoded.id });
        if (!mart)
            throw Errors_1.MartNotFoundError();
        const password_hash = await this.hasher.hash(password);
        await this.martsRepository.update({ id: decoded.id }, { password: password_hash });
        this.mailer.send(mart.email, "Sua Senha foi trocado", UnoCompras_1.UnoComprasTemplate(`<div> Senha Alterada com sucesso <div>`));
        return http_helper_1.success();
    }
}
exports.ChangePasswordByToken = ChangePasswordByToken;
