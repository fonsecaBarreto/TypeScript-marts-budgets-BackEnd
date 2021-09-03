"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinMartController = void 0;
const Errors_1 = require("../../../domain/protocols/Errors");
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class JoinMartController extends MainController_1.MainController {
    constructor(marsRepository, passwordGenerator, hasher, hooks) {
        super(MainController_1.AccessType.ADMIN);
        this.marsRepository = marsRepository;
        this.passwordGenerator = passwordGenerator;
        this.hasher = hasher;
        this.hooks = hooks;
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
        const updated = await this.marsRepository.find({ id });
        try {
            this.hooks({ ...updated, password });
        }
        catch (err) {
            console.log(err);
        }
        return http_helper_1.success(updated);
    }
}
exports.JoinMartController = JoinMartController;
