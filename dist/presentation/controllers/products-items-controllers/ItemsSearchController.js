"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsSearchController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class ItemsSearchController extends MainController_1.MainController {
    constructor(knexConnection, serializer) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
        this.knexConnection = knexConnection;
        this.serializer = serializer;
    }
    async getTotal() {
        const totalOfITems = await this.knexConnection('product_items').count('id', { as: 'count' }).first();
        return totalOfITems ? Number(totalOfITems.count) : 0;
    }
    async searchForItem(offset, text_words, categories) {
        const LIMIT = 16;
        var subTotal = 0;
        var items = [];
        var query = this.knexConnection('product_items').select("id", 'name', "description").offset(offset).limit(LIMIT);
        var count_query = this.knexConnection('product_items');
        if (categories.length > 0) {
            query.whereIn('category_id', categories);
            count_query.whereIn('category_id', categories);
        }
        if (text_words) {
            query.andWhere((query) => {
                for (const col of text_words) {
                    query.orWhere(`product_items.name`, 'ilike', `%${col}%`);
                }
            });
            count_query.andWhere((query) => {
                for (const col of text_words) {
                    query.orWhere(`product_items.name`, 'ilike', `%${col}%`);
                }
            });
        }
        count_query.count('id', { as: 'count' }).first();
        await Promise.all([
            count_query.then((count) => { subTotal = count ? Number(count.count) : 0; }),
            query.then(async (it) => { items = it; })
        ]);
        return { subTotal, items };
    }
    async searchForProduct(text_words, brands, categories) {
        if (text_words.length === 0)
            return [];
        let pruductsQuery = this.knexConnection('products').select(["id", 'description', 'item_id', 'brand_id']);
        var allowedItemsByCategories = await this.knexConnection('product_items').whereIn('category_id', categories);
        if (text_words) {
            pruductsQuery.andWhere((query) => {
                for (const col of text_words) {
                    query.orWhere(`products.description`, 'ilike', `%${col}%`);
                    query.orWhere(`products.ean`, 'ilike', `%${col}%`);
                }
            });
        }
        if (brands.length > 0) {
            pruductsQuery.andWhere((query) => {
                query.whereIn('products.brand_id', brands);
            });
        }
        if (categories.length > 0) {
            console.log(categories);
            pruductsQuery.andWhere((query) => {
                query.whereIn('products.item_id', allowedItemsByCategories);
            });
        }
        let requiredProducts = await pruductsQuery;
        return requiredProducts;
    }
    async findproductsInside(item_id, brands) {
        if (!item_id)
            return [];
        if ((brands === null || brands === void 0 ? void 0 : brands.length) > 0) {
            const result = await this.knexConnection('products').whereIn('brand_id', brands).andWhere({ "item_id": item_id }).select("*");
            return result;
        }
        else {
            const result = await this.knexConnection('products').where({ "item_id": item_id }).select("*");
            return result;
        }
    }
    async handler(request) {
        const text = request.query.v || '';
        var text_words = text.trim().split(" ");
        text_words = text_words.filter((c) => ((c !== "") && (c !== "de") && (c !== "para")));
        var categories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [request.query.c] : [];
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [request.query.b] : [];
        const offset = Number(request.query.o) || 0;
        console.log("searching for", text_words);
        var result = {
            total: await this.getTotal(),
            subTotal: 0,
            items: [],
            related_items: []
        };
        const { items, subTotal } = await this.searchForItem(offset, text_words, categories);
        result.items = items;
        result.subTotal = subTotal;
        const itemsFound = result.items.map((j, i) => (j.id));
        const productsFound = await this.searchForProduct(text_words, brands, categories);
        var relatedProduts = [...new Set(productsFound.map((p) => (p.id)))];
        var relatedItems = [...new Set(productsFound.map((p) => (p.item_id)))];
        relatedItems = relatedItems.filter((r, i) => (!itemsFound.includes(r)));
        result.related_items = await Promise.all(relatedItems.map(async (item_id, i) => {
            var products = [];
            var item = await this.knexConnection('product_items').where({ id: item_id }).select("id", 'name', "description").first();
            products = productsFound.filter((p) => (p.item_id === item_id));
            products = await Promise.all(products.map(async (p) => {
                var serialized = await this.serializer(p);
                return { ...serialized, distac: true };
            }));
            return ({ ...item, products });
        }));
        var text_columns = text.trim().split(" ");
        result.items = await Promise.all(result.items.map(async (j, i) => {
            var matched_words = [];
            var products = [];
            var products_matched_count = 0;
            products = await this.findproductsInside(j.id, brands);
            var nameSplited = j.name.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "").split(" ");
            nameSplited.map((n, i) => {
                if (text_columns.includes(n)) {
                    matched_words.push(n);
                }
            });
            if ((relatedProduts === null || relatedProduts === void 0 ? void 0 : relatedProduts.length) > 0) {
                products.forEach(p => {
                    if (relatedProduts.includes(p.id)) {
                        products_matched_count += 1;
                    }
                });
                products.sort((a, b) => !relatedProduts.includes(a.id) ? 1 : -1);
            }
            products = await Promise.all(products.map(async (p) => {
                var distac = false;
                var serialized = await this.serializer(p);
                if (relatedProduts.includes(p.id)) {
                    distac = true;
                }
                return { ...serialized, distac };
            }));
            return ({ ...j, products_matched_count, matched_words, products, });
        }));
        result.items.sort((a, b) => (a.products_matched_count < b.products_matched_count ? 1 : -1));
        return http_helper_1.success(result);
    }
}
exports.ItemsSearchController = ItemsSearchController;
