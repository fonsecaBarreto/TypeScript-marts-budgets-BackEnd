"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListCategories = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const CategoryListView_1 = require("./serializers/CategoryListView");
class FilterListCategories extends MainController_1.MainController {
    constructor(categoryRepository) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
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
