"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductItemController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Errors_1 = require("../../../domain/protocols/Errors");
const item_schemas_json_1 = require("../../schemas/item-schemas.json");
class UpdateProductItemController extends MainController_1.MainController {
    constructor(itemsRepository, categoryRepository, serializer) {
        super(MainController_1.AccessType.ADMIN, item_schemas_json_1.Update);
        this.itemsRepository = itemsRepository;
        this.categoryRepository = categoryRepository;
        this.serializer = serializer;
    }
    async handler(request) {
        const { name, description, category_id } = request.body;
        const id = request.params.id;
        var exists = await this.itemsRepository.find({ id });
        if (!exists)
            throw Errors_1.ProductItemNotFoundError();
        if (category_id) {
            const categoryExists = await this.categoryRepository.find({ id: category_id });
            if (!categoryExists)
                throw Errors_1.CategoryNotFoundError();
        }
        await this.itemsRepository.update({ id }, { name, category_id, description });
        var updated = await this.itemsRepository.find({ id });
        return http_helper_1.success(await this.serializer(updated));
    }
}
exports.UpdateProductItemController = UpdateProductItemController;
