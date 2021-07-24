"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMartAnnexController = exports.SignUpMartController = void 0;
const MainController_1 = require("../../helpers/MainController");
const Schemas_json_1 = require("./Schemas.json");
const http_helper_1 = require("../../helpers/http-helper");
const MultiPartContent_1 = require("../../helpers/MulterAdapter/MultiPartContent");
const schemasRows = Schemas_json_1.rows;
const SignUpSchema = {};
Schemas_json_1.SignUp.forEach((key) => SignUpSchema[key] = schemasRows[key]);
class SignUpMartController extends MainController_1.MainController {
    constructor(createNewMart) {
        super(MainController_1.AccessType.PUBLIC, SignUpSchema);
        this.createNewMart = createNewMart;
    }
    async handler(request) {
        const { name, email, phone, cnpj_cpf, transfer_allowed } = request.body;
        const annex = null;
        const image = null;
        const params = {
            name, email, phone, cnpj_cpf, transfer_allowed,
            password: null, annex, image,
        };
        const stored = await this.createNewMart.execute(params);
        return http_helper_1.success(stored);
    }
}
exports.SignUpMartController = SignUpMartController;
class UploadMartAnnexController extends MainController_1.MainController {
    constructor(martRepository) {
        super(MainController_1.AccessType.MART, null, MultiPartContent_1.ContentType.DOCUMENT);
        this.martRepository = martRepository;
    }
    async handler(request) {
        //Should store file and store name on database 
        return http_helper_1.success(request.file);
    }
}
exports.UploadMartAnnexController = UploadMartAnnexController;
