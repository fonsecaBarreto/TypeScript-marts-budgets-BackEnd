"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCategoriePrimaries = void 0;
const MainController_1 = require("../../helpers/MainController");
const http_helper_1 = require("../../helpers/http-helper");
const CategoryListView_1 = require("./serializers/CategoryListView");
class ListCategoriePrimaries extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const primaries = await this.categoryRepository.list({ category_id: null });
        return http_helper_1.success(await CategoryListView_1.MapCategoryListView(this.categoryRepository, primaries));
    }
}
exports.ListCategoriePrimaries = ListCategoriePrimaries;
