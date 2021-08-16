"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpMartController = void 0;
const MainController_1 = require("../../helpers/MainController");
const http_helper_1 = require("../../helpers/http-helper");
const mart_schemas_json_1 = require("../../schemas/mart-schemas.json");
const CommonErrors_1 = require("../../../domain/protocols/Errors/CommonErrors");
const schemasRows = mart_schemas_json_1.rows;
const SignUpSchema = {};
mart_schemas_json_1.SignUp.forEach((key) => SignUpSchema[key] = schemasRows[key]);
const annexSchema = {
    annexs: {
        optional: true,
        types: ['image/jpeg', 'image/png', 'application/pdf'],
        max_size: 5e+6,
        multiples: 10
    }
};
class SignUpMartController extends MainController_1.MainController {
    constructor(adressValidator, createAddress, createNewMart, createAnnex) {
        super(MainController_1.AccessType.PUBLIC, SignUpSchema, annexSchema);
        this.adressValidator = adressValidator;
        this.createAddress = createAddress;
        this.createNewMart = createNewMart;
        this.createAnnex = createAnnex;
    }
    async handler(request) {
        const { body, files } = request;
        const { annexs } = files;
        const { name, email, phone, cnpj_cpf, transfer_allowed, address, responsible_name } = body;
        //Validates the address
        const errors = await this.adressValidator.validate(JSON.parse(address));
        if (errors) {
            var outputErr = { address: {} };
            Object.keys(errors).map((e) => { outputErr.address[e] = errors[e]; });
            return http_helper_1.badRequest(CommonErrors_1.InvalidRequestBodyError(outputErr));
        }
        /* Check duplicity */
        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone);
        //store adress
        const storedAddress = await this.createAddress.execute(JSON.parse(address));
        //create new mart
        const params = {
            name, email, phone, cnpj_cpf, transfer_allowed, responsible_name,
            obs: "",
            password: null,
            image: null,
            address_id: storedAddress.id,
            financial_email: null,
            corporate_name: null
        };
        const stored = await this.createNewMart.execute(params);
        if (annexs) {
            await Promise.all(annexs.map(async (annex) => {
                await this.createAnnex.execute({
                    buffer: annex.buffer,
                    contentType: annex.contentType,
                    mart_id: stored.id,
                    name: (annex.fileName).split('.').slice(0, -1).join('.')
                });
            }));
        }
        return http_helper_1.success(stored);
    }
}
exports.SignUpMartController = SignUpMartController;
