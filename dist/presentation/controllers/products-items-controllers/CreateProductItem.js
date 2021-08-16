"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductItemController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Errors_1 = require("../../../domain/protocols/Errors");
const item_schemas_json_1 = require("../../schemas/item-schemas.json");
class CreateProductItemController extends MainController_1.MainController {
    constructor(itemsRepository, categoryRepository, idGenerator, serializer) {
        super(MainController_1.AccessType.ADMIN, item_schemas_json_1.Create);
        this.itemsRepository = itemsRepository;
        this.categoryRepository = categoryRepository;
        this.idGenerator = idGenerator;
        this.serializer = serializer;
    }
    async handler(request) {
        const { name, description, category_id } = request.body;
        const id = await this.idGenerator.generate();
        if (category_id) {
            const categoryExists = await this.categoryRepository.find({ id: category_id });
            if (!categoryExists)
                throw Errors_1.CategoryNotFoundError();
        }
        const item = { id, name, description, category_id };
        stored = await this.itemsRepository.insert(item);
        var stored = await this.itemsRepository.find({ id });
        return http_helper_1.success(await this.serializer(stored));
    }
}
exports.CreateProductItemController = CreateProductItemController;
