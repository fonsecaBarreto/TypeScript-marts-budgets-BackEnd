"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinMartController = void 0;
const Errors_1 = require("../../../domain/protocols/Errors");
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const UnoCompras_1 = require("../../helpers/EmailLayouts/UnoCompras");
class JoinMartController extends MainController_1.MainController {
    constructor(marsRepository, passwordGenerator, hasher, mailer) {
        super(MainController_1.AccessType.ADMIN);
        this.marsRepository = marsRepository;
        this.passwordGenerator = passwordGenerator;
        this.hasher = hasher;
        this.mailer = mailer;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.marsRepository.find({ id });
        if (!exists)
            throw Errors_1.MartNotFoundError();
        if (exists.password)
            throw Errors_1.MartAlreadyVerifiedError();
        const password = await this.passwordGenerator.generate();
        const password_hash = await this.hasher.hash(password);
        await this.marsRepository.update({ id }, { password: password_hash });
        this.mailer.send(exists.email, "Bem Vindo ao UnaCompras", UnoCompras_1.UnoComprasTemplate(`
            <h2> Bem Vindo ao UnoCompra  </h2>
            <h2 style=" color: #333; font-size:20px;"> Sua Senha:</h2>
            <h2 style="padding: 10px 32px; border: dashed 3px #ccc; width: fit-content; margin:auto">
                ${password}
            </h2>
        `));
        const updated = await this.marsRepository.find({ id });
        return http_helper_1.success(updated);
    }
}
exports.JoinMartController = JoinMartController;
