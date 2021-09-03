"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpMartController = void 0;
const MainController_1 = require("../../helpers/MainController");
const http_helper_1 = require("../../helpers/http-helper");
const CommonErrors_1 = require("../../../domain/protocols/Errors/CommonErrors");
class SignUpMartController extends MainController_1.MainController {
    constructor(signUpSchema, fileSchema, adressValidator, createAddress, createNewMart, createAnnex, hooks) {
        super(MainController_1.AccessType.PUBLIC, signUpSchema, fileSchema);
        this.adressValidator = adressValidator;
        this.createAddress = createAddress;
        this.createNewMart = createNewMart;
        this.createAnnex = createAnnex;
        this.hooks = hooks;
    }
    async validateAddress(json) {
        var address = JSON.parse(json);
        const errors = await this.adressValidator.validate(address);
        if (errors) {
            throw CommonErrors_1.InvalidRequestBodyError({ address: errors });
        }
        return address;
    }
    async addAnnexs(annexs, mart_id) {
        if (annexs) {
            await Promise.all(annexs.map(async (annex) => {
                await this.createAnnex.execute({
                    buffer: annex.buffer,
                    contentType: annex.contentType,
                    mart_id,
                    name: (annex.fileName).split('.').slice(0, -1).join('.')
                });
            }));
        }
    }
    async handler(request) {
        const { body, files } = request;
        const { annexs } = files;
        var { name, email, phone, cnpj_cpf, transfer_allowed, address, responsible_name } = body;
        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone);
        try {
            address = await this.validateAddress(address);
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) == "ApplicationError") {
                return http_helper_1.badRequest(err);
            }
            return http_helper_1.serverError();
        }
        const storedAddress = await this.createAddress.execute(address);
        const params = {
            name, email, phone, cnpj_cpf, transfer_allowed, responsible_name,
            obs: "",
            password: null,
            image: null,
            financial_email: null,
            corporate_name: null,
            address_id: storedAddress.id
        };
        const stored = await this.createNewMart.execute(params);
        await this.addAnnexs(annexs, stored.id);
        try {
            this.hooks(stored);
        }
        catch (err) {
            console.log(err);
        }
        return http_helper_1.success(stored);
    }
}
exports.SignUpMartController = SignUpMartController;
