"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.UpdateMartController = exports.CreateMartController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const mart_schemas_json_1 = require("../../schemas/mart-schemas.json");
const schemasRows = mart_schemas_json_1.rows;
const CreateSchema = {};
mart_schemas_json_1.Create.forEach((key) => CreateSchema[key] = schemasRows[key]);
const UpdateSchema = {};
mart_schemas_json_1.Update.forEach((key) => UpdateSchema[key] = schemasRows[key]);
class CreateMartController extends MainController_1.MainController {
    constructor(createNewMart) {
        super(MainController_1.AccessType.ADMIN, CreateSchema);
        this.createNewMart = createNewMart;
    }
    async handler(request) {
        const stored = await this.createNewMart.execute(request.body);
        return http_helper_1.success(stored);
    }
}
exports.CreateMartController = CreateMartController;
class UpdateMartController extends MainController_1.MainController {
    constructor(createNewMart) {
        super(MainController_1.AccessType.ADMIN, UpdateSchema);
        this.createNewMart = createNewMart;
    }
    async handler(request) {
        console.log(request);
        const stored = await this.createNewMart.update({ id: request.params.id, ...request.body });
        return http_helper_1.success(stored);
    }
}
exports.UpdateMartController = UpdateMartController;
/* Find, Remove, List */
class FindController extends MainController_1.MainController {
    constructor(martApp) {
        super(MainController_1.AccessType.ADMIN);
        this.martApp = martApp;
    }
    async handler(request) {
        const result = await this.martApp.find(request.params.id);
        if (request.params.id) {
            return http_helper_1.success(result);
        }
        else {
            return http_helper_1.success(await mapMartsToAdmin(result));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(martApp) {
        super(MainController_1.AccessType.ADMIN);
        this.martApp = martApp;
    }
    async handler(request) {
        return http_helper_1.success(await this.martApp.remove(request.params.id));
    }
}
exports.RemoveController = RemoveController;
const mapMartsToAdmin = (marts) => {
    if (marts.length === 0)
        return Promise.resolve([]);
    return Promise.all(marts.map(async (m) => {
        const novo = ({ ...m, isActive: m.password ? true : false });
        delete novo.password;
        return novo;
    }));
};
