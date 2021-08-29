"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../factories/orders");
exports.default = (router) => {
    router.get('/orders/list', orders_1.listOrdersByFilter.execute());
    router.get('/orders/latest', orders_1.listOrdersLatest.execute());
    /*  admin */
    router.route('/orders/make')
        .post(orders_1.makeOrder.execute());
};
