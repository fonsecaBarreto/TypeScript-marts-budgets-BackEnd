"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.CreateCategoryController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Errors_1 = require("../../../domain/protocols/Errors");
const category_Schemas_json_1 = require("../../schemas/category-Schemas.json");
class CreateCategoryController extends MainController_1.MainController {
    constructor(categoryRepository, idGenerator) {
        super(MainController_1.AccessType.ADMIN, category_Schemas_json_1.Create);
        this.categoryRepository = categoryRepository;
        this.idGenerator = idGenerator;
    }
    async handler(request) {
        const { name, category_id } = request.body;
        if (request.params.id) {
            var exits = await this.categoryRepository.find({ id: request.params.id });
            if (!exits)
                throw Errors_1.CategoryNotFoundError();
        }
        const id = (request.params.id) || await this.idGenerator.generate();
        if (category_id) {
            const fatherExists = await this.categoryRepository.find({ id: category_id });
            if (!fatherExists)
                throw Errors_1.CategoryNotFoundError();
            if (fatherExists.id === id)
                throw Errors_1.CategoryConflictError(); //Should not be father of it self
        }
        /* persistence */
        if (request.params.id) {
            stored = await this.categoryRepository.update({ id }, { name, category_id });
        }
        else {
            const category = { id, name, category_id };
            stored = await this.categoryRepository.insert(category);
        }
        var stored = await this.categoryRepository.find({ id });
        return http_helper_1.success(stored);
    }
}
exports.CreateCategoryController = CreateCategoryController;
class FindController extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const id = request.params.id;
        if (id) {
            return http_helper_1.success(await this.categoryRepository.find({ id }));
        }
        else {
            return http_helper_1.success(await this.categoryRepository.list({}));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.categoryRepository.find({ id });
        if (!exists)
            throw Errors_1.CategoryNotFoundError();
        await this.categoryRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
