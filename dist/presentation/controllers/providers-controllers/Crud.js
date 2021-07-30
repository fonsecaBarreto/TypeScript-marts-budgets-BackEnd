"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.CreateProviderController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const provider_schemas_json_1 = require("../../schemas/provider-schemas.json");
const Errors_1 = require("../../../domain/protocols/Errors");
class CreateProviderController extends MainController_1.MainController {
    constructor(providersRepository, idGenerator) {
        super(MainController_1.AccessType.ADMIN, provider_schemas_json_1.Create);
        this.providersRepository = providersRepository;
        this.idGenerator = idGenerator;
    }
    async check(email, phone, provider) {
        const emailExists = await this.providersRepository.find({ email });
        if (emailExists) {
            if (!provider || ((provider === null || provider === void 0 ? void 0 : provider.email) !== email)) {
                throw Errors_1.EmailInUseError();
            }
        }
        if (phone) {
            const phoneExists = await this.providersRepository.find({ phone });
            if (phoneExists) {
                if (!provider || ((provider === null || provider === void 0 ? void 0 : provider.phone) !== phone)) {
                    throw Errors_1.PhoneInUseError();
                }
            }
        }
    }
    async handler(request) {
        var provider;
        const id = request.params.id;
        const { name, email, phone } = request.body;
        if (id) {
            provider = await this.providersRepository.find({ id });
            if (!provider)
                throw Errors_1.ProviderNotFoundError();
        }
        await this.check(email, phone, provider);
        var provider_id;
        if (id) {
            stored = await this.providersRepository.update({ id }, { name, email, phone });
            provider_id = id;
        }
        else {
            var provider_id = await this.idGenerator.generate();
            const novo = { id: provider_id, name, email, phone };
            stored = await this.providersRepository.insert(novo);
        }
        var stored = await this.providersRepository.find({ id: provider_id });
        return http_helper_1.success(stored);
    }
}
exports.CreateProviderController = CreateProviderController;
class FindController extends MainController_1.MainController {
    constructor(providersRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.providersRepository = providersRepository;
    }
    async handler(request) {
        const id = request.params.id;
        if (id) {
            return http_helper_1.success(await this.providersRepository.find({ id }));
        }
        else {
            return http_helper_1.success(await this.providersRepository.list({}));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(providersRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.providersRepository = providersRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.providersRepository.find({ id });
        if (!exists)
            throw Errors_1.ProviderNotFoundError();
        await this.providersRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
