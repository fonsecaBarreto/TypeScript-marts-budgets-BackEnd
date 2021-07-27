"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMartAnnexController = exports.SignUpMartController = void 0;
const MainController_1 = require("../../helpers/MainController");
const mart_schemas_json_1 = require("../../schemas/mart-schemas.json");
const http_helper_1 = require("../../helpers/http-helper");
const schemasRows = mart_schemas_json_1.rows;
const SignUpSchema = {};
mart_schemas_json_1.SignUp.forEach((key) => SignUpSchema[key] = schemasRows[key]);
const annexSchema = {
    annex: {
        optional: true,
        types: ['image/jpeg', 'image/png', 'application/pdf'],
        max_size: 10e+6,
    }
};
class SignUpMartController extends MainController_1.MainController {
    constructor(createNewMart, fileRepository) {
        super(MainController_1.AccessType.PUBLIC, SignUpSchema, annexSchema);
        this.createNewMart = createNewMart;
        this.fileRepository = fileRepository;
    }
    async handler(request) {
        const { body, files } = request;
        const { name, email, phone, cnpj_cpf, transfer_allowed } = body;
        const { annex } = files;
        // save the file
        var annex_name = null;
        if (annex) {
            const fileStored = await this.fileRepository.save({
                buffer: annex.buffer,
                contentType: annex.contentType,
                name: "documents/strict_document_" + Date.now()
            });
            annex_name = fileStored.name;
        }
        //create new mart
        const params = {
            name, email, phone, cnpj_cpf, transfer_allowed,
            password: null,
            image: null,
            annex: annex_name
        };
        const stored = await this.createNewMart.execute(params);
        return http_helper_1.success(stored);
    }
}
exports.SignUpMartController = SignUpMartController;
/*  */
class UploadMartAnnexController extends MainController_1.MainController {
    constructor(martRepository, fileRepository) {
        super(MainController_1.AccessType.MART, null, annexSchema);
        this.martRepository = martRepository;
        this.fileRepository = fileRepository;
    }
    async handler(request) {
        return http_helper_1.success("ok");
    }
}
exports.UploadMartAnnexController = UploadMartAnnexController;
