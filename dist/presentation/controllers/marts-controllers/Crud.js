"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.UpdateMartController = exports.CreateMartController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const mart_schemas_json_1 = require("../../schemas/mart-schemas.json");
const Errors_1 = require("../../../domain/protocols/Errors");
const MartPrivateView_1 = require("./serializers/MartPrivateView");
const schemasRows = mart_schemas_json_1.rows;
const CreateSchema = {};
mart_schemas_json_1.Create.forEach((key) => CreateSchema[key] = schemasRows[key]);
const UpdateSchema = {};
mart_schemas_json_1.Update.forEach((key) => UpdateSchema[key] = schemasRows[key]);
class CreateMartController extends MainController_1.MainController {
    constructor(adressValidator, createAddress, createNewMart, serializer) {
        super(MainController_1.AccessType.ADMIN, CreateSchema);
        this.adressValidator = adressValidator;
        this.createAddress = createAddress;
        this.createNewMart = createNewMart;
        this.serializer = serializer;
    }
    async handler(request) {
        const { password, passwordConfirmation, name, cnpj_cpf, email, phone, transfer_allowed, responsible_name, corporate_name, financial_email, obs, address } = request.body;
        if (password !== passwordConfirmation)
            throw Errors_1.DisagreementPasswordError();
        const errors = await this.adressValidator.validate(JSON.parse(address));
        if (errors) {
            var outputErr = { address: {} };
            Object.keys(errors).map((e) => { outputErr.address[e] = errors[e]; });
            return http_helper_1.badRequest(Errors_1.InvalidRequestBodyError(outputErr));
        }
        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone, corporate_name, financial_email);
        const storedAddress = await this.createAddress.execute(JSON.parse(address));
        //create new mart
        const params = {
            name, email, phone, cnpj_cpf, transfer_allowed, password,
            image: null,
            address_id: storedAddress.id,
            responsible_name,
            obs,
            financial_email,
            corporate_name
        };
        const stored = await this.createNewMart.execute(params);
        return http_helper_1.success(await this.serializer(stored));
    }
}
exports.CreateMartController = CreateMartController;
class UpdateMartController extends MainController_1.MainController {
    constructor(createNewMart, serializer) {
        super(MainController_1.AccessType.ADMIN, UpdateSchema);
        this.createNewMart = createNewMart;
        this.serializer = serializer;
    }
    async handler(request) {
        const { name, cnpj_cpf, email, phone, transfer_allowed, responsible_name, corporate_name, financial_email, obs } = request.body;
        const stored = await this.createNewMart.update({ id: request.params.id, name, cnpj_cpf, email, phone, transfer_allowed,
            responsible_name, corporate_name, financial_email, obs });
        return http_helper_1.success(stored);
    }
}
exports.UpdateMartController = UpdateMartController;
/* Find, Remove, List */
class FindController extends MainController_1.MainController {
    constructor(findApp, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.findApp = findApp;
        this.serializer = serializer;
    }
    async handler(request) {
        const result = await this.findApp.execute(request.params.id);
        if (request.params.id) {
            return http_helper_1.success(await this.serializer(result));
        }
        else {
            return http_helper_1.success(await MartPrivateView_1.MapMarts(result, this.serializer));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(martsRepository, addressRepository, annexsRepository, fileRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.martsRepository = martsRepository;
        this.addressRepository = addressRepository;
        this.annexsRepository = annexsRepository;
        this.fileRepository = fileRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.martsRepository.find({ id });
        if (!exists)
            throw Errors_1.MartNotFoundError();
        if (exists.image) {
            await this.fileRepository.remove(exists.image);
        }
        if (exists.address_id) {
            await this.addressRepository.remove({ id: exists.address_id });
        }
        var annexes = await this.annexsRepository.list({ mart_id: exists.id });
        console.log(annexes);
        if ((annexes === null || annexes === void 0 ? void 0 : annexes.length) > 0) {
            await Promise.all(annexes.map(async (a) => {
                try {
                    await this.fileRepository.remove(a.name);
                }
                catch (err) {
                    console.log(err);
                }
            }));
        }
        //Anexos Should be deleted here
        await this.martsRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
