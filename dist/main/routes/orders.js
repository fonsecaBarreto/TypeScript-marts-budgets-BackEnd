"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../factories/orders");
const index_1 = require("../factories/orders/index");
exports.default = (router) => {
    router.get('/orders/list', orders_1.listOrdersByFilter.execute());
    router.get('/orders/latest', orders_1.listOrdersLatest.execute());
    router.route('/orders/make')
        .post(index_1.controllers.order.execute());
};
