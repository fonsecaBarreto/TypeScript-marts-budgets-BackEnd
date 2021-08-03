"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../factories/orders");
exports.default = (router) => {
    /*  admin */
    router.route('/orders/make')
        .post(orders_1.makeOrder.execute());
};
