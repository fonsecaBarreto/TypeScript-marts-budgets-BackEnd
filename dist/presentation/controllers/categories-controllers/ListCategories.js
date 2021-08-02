"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListCategories = exports.ListCategoriesTree = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const CategoryTreeView_1 = require("./serializers/CategoryTreeView");
const CategoryListView_1 = require("./serializers/CategoryListView");
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
class FilterListCategories extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.categoryRepository = categoryRepository;
    }
    async handler(request) {
        const text = request.query.v || '';
        const c = request.query.c || null;
        const offset = Number(request.query.o) || 0;
        var where = c ? { category_id: c } : {};
        const total = await this.categoryRepository.count({}, 'id');
        var { queryData, queryTotal } = await this.categoryRepository.listAlike(['name'], text, where, {}, offset, 16);
        const listFeed = {
            total,
            subTotal: queryTotal,
            queries: { text: text },
            data: await CategoryListView_1.MapCategoryListView(this.categoryRepository, queryData)
        };
        return http_helper_1.success(listFeed);
    }
}
exports.FilterListCategories = FilterListCategories;
