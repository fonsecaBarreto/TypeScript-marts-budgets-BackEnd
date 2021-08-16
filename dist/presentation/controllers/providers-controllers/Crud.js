"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.CreateProviderController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Errors_1 = require("../../../domain/protocols/Errors");
const ProvidersErrors_1 = require("../../../domain/protocols/Errors/ProvidersErrors");
const ProviderPrivateView_1 = require("./serializers/ProviderPrivateView");
class CreateProviderController extends MainController_1.MainController {
    constructor(adressValidator, createAddress, providersRepository, idGenerator, serializer, schema) {
        super(MainController_1.AccessType.ADMIN, schema);
        this.adressValidator = adressValidator;
        this.createAddress = createAddress;
        this.providersRepository = providersRepository;
        this.idGenerator = idGenerator;
        this.serializer = serializer;
    }
    async check(corporate_name, cnpj, email, phone, financial_email, provider) {
        const cNameExists = await this.providersRepository.find({ corporate_name });
        if (cNameExists) {
            if (!provider || ((provider === null || provider === void 0 ? void 0 : provider.corporate_name) !== corporate_name)) {
                throw ProvidersErrors_1.CorporateNameInUseError();
            }
        }
        const cnpjExists = await this.providersRepository.find({ cnpj });
        if (cnpjExists) {
            if (!provider || ((provider === null || provider === void 0 ? void 0 : provider.cnpj) !== cnpj)) {
                throw ProvidersErrors_1.CnpjInUseError();
            }
        }
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
        if (financial_email) {
            const financialEmailExits = await this.providersRepository.find({ financial_email });
            if (financialEmailExits) {
                if ((!provider) || provider.financial_email !== financial_email)
                    throw Errors_1.FinancialEmailInUseError();
            }
        }
    }
    async handler(request) {
        var provider;
        const provider_id = request.params.id;
        const { name, email, phone, corporate_name, cnpj, obs, responsible_name, financial_email, address } = request.body;
        if (provider_id) {
            provider = await this.providersRepository.find({ id: provider_id });
            if (!provider)
                throw Errors_1.ProviderNotFoundError();
        }
        await this.check(corporate_name, cnpj, email, phone, financial_email, provider);
        const id = provider_id ? provider_id : await this.idGenerator.generate();
        if (provider_id) {
            stored = await this.providersRepository.update({ id }, { name, email, phone, obs, corporate_name, cnpj, responsible_name, financial_email });
        }
        else {
            const errors = await this.adressValidator.validate(JSON.parse(address));
            if (errors) {
                var outputErr = { address: {} };
                Object.keys(errors).map((e) => { outputErr.address[e] = errors[e]; });
                return http_helper_1.badRequest(Errors_1.InvalidRequestBodyError(outputErr));
            }
            const storedAddress = await this.createAddress.execute(JSON.parse(address));
            const novo = { id, corporate_name, cnpj, name, email, phone, obs, responsible_name, financial_email, address_id: storedAddress.id };
            stored = await this.providersRepository.insert(novo);
        }
        var stored = await this.providersRepository.find({ id });
        return http_helper_1.success(await this.serializer(stored));
    }
}
exports.CreateProviderController = CreateProviderController;
class FindController extends MainController_1.MainController {
    constructor(providersRepository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.providersRepository = providersRepository;
        this.serializer = serializer;
    }
    async handler(request) {
        const id = request.params.id;
        if (id) {
            const result = await this.providersRepository.find({ id });
            return http_helper_1.success(await this.serializer(result));
        }
        else {
            const results = await this.providersRepository.list({}, [], 'created_at');
            return http_helper_1.success(await ProviderPrivateView_1.mapProviders(results, this.serializer));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(providersRepository, addressRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.providersRepository = providersRepository;
        this.addressRepository = addressRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.providersRepository.find({ id });
        if (!exists)
            throw Errors_1.ProviderNotFoundError();
        if (exists.address_id) {
            await this.addressRepository.remove({ id: exists.address_id });
        }
        await this.providersRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
