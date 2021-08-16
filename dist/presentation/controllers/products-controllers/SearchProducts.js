"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProductController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const ProductSearchView_1 = require("./serializers/ProductSearchView");
class SearchProductController extends MainController_1.MainController {
    constructor(knexConnection, serializer) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
        this.knexConnection = knexConnection;
        this.serializer = serializer;
    }
    async getCategoriesChilds(category_id) {
        var childs = await this.knexConnection('categories').where({ "category_id": category_id }).select(["id"]);
        await Promise.all(childs.map(async (ch) => {
            let grandsons = await this.getCategoriesChilds(ch.id);
            childs = [...childs, ...grandsons];
        }));
        return childs;
    }
    async handleCategories(query, count_query, categories) {
        if (categories.length == 0)
            return;
        await Promise.all(categories.map(async (c_id) => {
            const childs = await this.getCategoriesChilds(c_id);
            categories = [...categories, ...childs.map(child => child.id)];
        }));
        categories = [...new Set(categories)];
        console.log(categories);
        query.whereIn('category_id', categories);
        count_query.whereIn('category_id', categories);
    }
    async handleBrands(query, count_query, brands) {
        if (brands.length == 0)
            return;
        query.whereIn('brand_id', brands);
        count_query.whereIn('brand_id', brands);
    }
    async handleDescriptionLike(query, count_query, description) {
        query.andWhere(`products.description`, 'ilike', `%${description}%`);
        count_query.andWhere(`products.description`, 'ilike', `%${description}%`);
    }
    async handler(request) {
        const description = request.query.v || '';
        var categories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [request.query.c] : [];
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [request.query.b] : [];
        const pageIndex = Number(request.query.p) || 0;
        const limit = 16;
        const offset = pageIndex * limit;
        const currentPage = pageIndex;
        var total = 0;
        var products = [];
        /* Count all */
        const totalOfProfucts = await this.knexConnection('products').count('id', { as: 'count' }).first();
        total = totalOfProfucts ? Number(totalOfProfucts.count) : 0;
        /* Create query */
        var query = this.knexConnection('products').select('*').offset(offset).limit(limit);
        var count_query = this.knexConnection('products');
        await this.handleCategories(query, count_query, categories); // insure all categories childs are included
        await this.handleBrands(query, count_query, brands);
        await this.handleDescriptionLike(query, count_query, description);
        count_query.count('id', { as: 'count' }).first();
        var result = { total, subTotal: 0, totalPages: 0, currentPage, products };
        const resulta = await Promise.all([
            count_query.then((count) => {
                var subTotal = count ? Number(count.count) : 0;
                result.subTotal = subTotal;
                result.totalPages = Math.ceil(subTotal / limit);
            }),
            query.then(async (products) => {
                result.products = await ProductSearchView_1.mapProductSearchView(products, this.serializer);
            })
        ]);
        console.log(resulta);
        return http_helper_1.success(result);
    }
}
exports.SearchProductController = SearchProductController;
