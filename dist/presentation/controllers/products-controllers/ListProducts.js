"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListProduct = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class FilterListProduct extends MainController_1.MainController {
    constructor(productsRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.productsRepository = productsRepository;
    }
    async handler(request) {
        const text = request.query.v || '';
        var category_id = request.query.c || null;
        const offset = Number(request.query.o) || 0;
        const total = await this.productsRepository.count({}, 'id');
        const where = category_id ? { category_id } : {};
        const { queryData, queryTotal } = await this.productsRepository.listAlike(['description', 'ncm', 'ean', 'sku', 'brand'], text, where, {}, offset, 16);
        const providerListFeed = {
            total,
            subTotal: queryTotal,
            queries: { text, category_id },
            data: queryData
        };
        return http_helper_1.success(providerListFeed);
    }
}
exports.FilterListProduct = FilterListProduct;
