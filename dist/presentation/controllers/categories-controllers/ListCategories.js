"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCategoriesTree = exports.ListPrimaryCategories = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const CategoryListView_1 = require("./serializers/CategoryListView");
class ListPrimaryCategories extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const categories = await this.categoryRepository.list({ category_id: null });
        return http_helper_1.success(await CategoryListView_1.MapCategoryListView(categories));
    }
}
exports.ListPrimaryCategories = ListPrimaryCategories;
class ListCategoriesTree extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const categories = await this.categoryRepository.list({ category_id: null });
        return http_helper_1.success(await CategoryListView_1.MapCategoryTreeView(this.categoryRepository, categories));
    }
}
exports.ListCategoriesTree = ListCategoriesTree;
