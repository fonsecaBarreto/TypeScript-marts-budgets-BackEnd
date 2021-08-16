"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOrdersByFilter = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class ListOrdersByFilter extends MainController_1.MainController {
    constructor(knexConnection, productSerializer, orderSerializer) {
        super(MainController_1.AccessType.ADMIN);
        this.knexConnection = knexConnection;
        this.productSerializer = productSerializer;
        this.orderSerializer = orderSerializer;
    }
    isDateValid(date_string) {
        if (!date_string)
            return null;
        if (!isNaN(Date.parse(date_string))) {
            return new Date(date_string);
        }
        return null;
    }
    async groupPerProduct(orders) {
        if (!orders)
            return [];
        var products = await Promise.all(orders.map(r => {
            return r.product_id;
        }));
        products = [...new Set(products)];
        const groups = await Promise.all(products.map(async (p) => {
            let productExists = await this.knexConnection('products').where({ id: p }).first();
            if (!productExists)
                return null;
            let quantities = 0;
            let productsOrders = orders.filter(o => {
                if (o.product_id == p) {
                    quantities += o.quantity;
                    return o;
                }
            });
            let group = {
                quantities,
                product: await this.productSerializer(productExists),
                orders: await Promise.all(productsOrders.map(async (o) => await this.orderSerializer(o)))
            };
            return group;
        }));
        return groups.filter(g => (g != null));
    }
    findByForecast(query, queryCount, MAX_DATE) {
        if (MAX_DATE) {
            query.whereBetween('forecast', [MAX_DATE, Infinity]);
            queryCount.whereBetween('forecast', [MAX_DATE, Infinity]);
        }
    }
    async findByProductParams(query, queryCount, productsDescription, brands_ids, items_ids) {
        if (!productsDescription && brands_ids.length == 0)
            return;
        //get to Know all the allowed products
        let pruductsQuery = this.knexConnection('products').select("id");
        if (productsDescription) {
            pruductsQuery.andWhere((query) => {
                query.orWhere(`products.description`, 'ilike', `%${productsDescription}%`);
                query.orWhere(`products.ean`, 'ilike', `%${productsDescription}%`);
                /*  query.orWhere({ ean :`${productsDescription}%`}) */
            });
        }
        if (brands_ids.length > 0) {
            pruductsQuery.whereIn(`brand_id`, brands_ids); // filter
        }
        if (items_ids.length > 0) {
            pruductsQuery.orWhereIn('products.item_id', items_ids); //includes
        }
        let allowedProducts = await pruductsQuery;
        console.log('allowed', allowedProducts);
        let productsIds = allowedProducts.map(p => (p.id));
        query.whereIn('orders.product_id', productsIds);
        queryCount.whereIn('orders.product_id', productsIds);
    }
    async findRelatedItem(text) {
        if (text) {
            const relatedItems = await this.knexConnection('product_items').select("id").where(`product_items.name`, 'ilike', `%${text}%`);
            if (relatedItems === null || relatedItems === void 0 ? void 0 : relatedItems.length)
                return relatedItems.map(r => (r.id));
        }
        return [];
    }
    async handler(request) {
        const MAX_DATE = this.isDateValid(request.query.d); //Date
        var BRANDS = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [request.query.b] : [];
        const PRODUCT_DESCRIPTION = request.query.p || null; // text
        const totalOrders = await this.knexConnection('orders').count('id', { as: 'count' }).first();
        const TOTAL = totalOrders ? Number(totalOrders.count) : 0;
        const query = this.knexConnection('orders').where({});
        const queryCount = this.knexConnection('orders').where({});
        await this.findByForecast(query, queryCount, MAX_DATE);
        const relatedItems = await this.findRelatedItem(PRODUCT_DESCRIPTION);
        console.log(relatedItems);
        await this.findByProductParams(query, queryCount, PRODUCT_DESCRIPTION, BRANDS, relatedItems);
        const result = await query;
        const count = await queryCount.count('id', { as: 'count' }).first();
        const orderGroups = await this.groupPerProduct(result);
        const test = {
            total: TOTAL,
            ordersTotal: count ? Number(count.count) : 0,
            groups: orderGroups
        };
        return http_helper_1.success(test);
    }
}
exports.ListOrdersByFilter = ListOrdersByFilter;
//
