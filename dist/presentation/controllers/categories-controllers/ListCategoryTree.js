"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCategoriesTree = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const CategoryTreeView_1 = require("./serializers/CategoryTreeView");
class ListCategoriesTree extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const sup = request.query.s || null;
        const categories = await this.categoryRepository.list({ category_id: sup });
        return http_helper_1.success(await CategoryTreeView_1.MapCategoryTreeView(this.categoryRepository, categories, CategoryTreeView_1.MakeCategoryTreeView));
    }
}
exports.ListCategoriesTree = ListCategoriesTree;
