"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const http_helper_1 = require("../helpers/http-helper");
const MainController_1 = require("../helpers/MainController");
class MetricsController extends MainController_1.MainController {
    constructor(knexConnection) {
        super(MainController_1.AccessType.ADMIN, null);
        this.knexConnection = knexConnection;
    }
    async handler(request) {
        var aux = await this.knexConnection('products').where({}).count('id', { as: 'count' }).first();
        var totalProducts = !aux ? 0 : Number(aux.count);
        aux = await this.knexConnection('marts').where({}).count('id', { as: 'count' }).first();
        var totalMarts = !aux ? 0 : Number(aux.count);
        aux = await this.knexConnection('providers').where({}).count('id', { as: 'count' }).first();
        var totalProviders = !aux ? 0 : Number(aux.count);
        aux = await this.knexConnection('orders').where({}).count('id', { as: 'count' }).first();
        var totalOrders = !aux ? 0 : Number(aux.count);
        var lastMarts = await this.knexConnection('marts').select(['id', 'name', 'created_at']).limit(5).orderBy('created_at', 'asc');
        var lastOrders = await this.knexConnection('orders').limit(5).orderBy('created_at', 'asc');
        if (lastOrders.length > 0) {
            lastOrders = await Promise.all(lastOrders.map(async (o) => {
                var p = await this.knexConnection('products').select(['description', 'id']).where({ id: o.product_id }).first();
                var m = await this.knexConnection('marts').select(['name', 'id']).where({ id: o.mart_id }).first();
                var product = p && { label: p.description, value: p.id };
                var mart = m && { label: m.name, value: p.id };
                return { ...o, product, mart };
            }));
        }
        const result = {
            totalMarts,
            totalProducts,
            totalProviders,
            totalOrders,
            lastMarts,
            lastOrders
        };
        return http_helper_1.success(result);
    }
}
exports.MetricsController = MetricsController;
