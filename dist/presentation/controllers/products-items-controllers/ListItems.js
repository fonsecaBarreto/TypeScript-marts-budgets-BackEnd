"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListItem = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class FilterListItem extends MainController_1.MainController {
    constructor(itemsRepository, knexConnection, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.itemsRepository = itemsRepository;
        this.knexConnection = knexConnection;
        this.serializer = serializer;
    }
    async findproductsInside(item_id) {
        if (!item_id)
            return [];
        const result = await this.knexConnection('products').where({ "item_id": item_id }).select("*");
        return result;
    }
    async filterByBrands(brands) {
        if (brands.length === 0)
            return [];
        let productsBrandsQuery = this.knexConnection('products').select(["id", 'description', 'item_id']);
        if (brands.length > 0) {
            productsBrandsQuery.where((query) => {
                query.whereIn('products.brand_id', brands);
            });
        }
        let matchedBrands = await productsBrandsQuery;
        let itemIds = matchedBrands.map(p => (p.item_id));
        return itemIds;
    }
    async findByItemsName(query, count_query, itemsName) {
        if (!itemsName)
            return;
        query.andWhere((query) => { query.where(`product_items.name`, 'ilike', `%${itemsName}%`); });
        count_query.andWhere((query) => { query.where(`product_items.name`, 'ilike', `%${itemsName}%`); });
    }
    async findByProductParams(query, count_query, text, brands) {
        if (!text)
            return;
        let productsQuery = this.knexConnection('products').select(["id", 'description', 'item_id']);
        if (brands.length > 0) {
            productsQuery.whereIn('products.brand_id', brands);
        }
        productsQuery.andWhere((query) => {
            query.orWhere(`products.description`, 'ilike', `%${text}%`);
            query.orWhere(`products.ean`, 'ilike', `%${text}%`);
        });
        let allowedProducts = await productsQuery;
        let itemIds = allowedProducts.map(p => (p.item_id));
        query.andWhere((query) => {
            query.whereIn(`product_items.id`, itemIds);
        });
        count_query.andWhere((query) => {
            query.whereIn(`product_items.id`, itemIds);
        });
        return allowedProducts.map(p => (p.id));
    }
    async handler(request) {
        const LIMIT = 6;
        const OFFSET = Number(request.query.o) || 0;
        const item_name = request.query.item || '';
        const product_description = request.query.product || '';
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [request.query.b] : [];
        const result = {
            total: await this.itemsRepository.count({}, 'id'),
            subTotal: 0,
            data: []
        };
        var query = this.knexConnection('product_items').select("*").offset(OFFSET).limit(LIMIT);
        var count_query = this.knexConnection('product_items');
        var requiredProducts = [];
        if (item_name) {
            await this.findByItemsName(query, count_query, item_name);
        }
        if (product_description) {
            requiredProducts = await this.findByProductParams(query, count_query, product_description, brands);
        }
        const queryResult = await query;
        const count = await count_query.count('id', { as: 'count' }).first();
        result.subTotal = count ? Number(count.count) : 0;
        result.data = queryResult;
        result.data = await Promise.all(queryResult.map(async (i) => {
            let products = [];
            const productsquery = this.knexConnection('products').where({ item_id: i.id });
            if (product_description) {
                productsquery.andWhere(query => {
                    query.whereIn('products.id', requiredProducts);
                });
            }
            products = await productsquery;
            products = await Promise.all(products.map(p => (this.serializer(p))));
            return { ...i, products };
        }));
        return http_helper_1.success(result);
    }
}
exports.FilterListItem = FilterListItem;
