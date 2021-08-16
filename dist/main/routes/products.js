"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../factories/products");
exports.default = (router) => {
    /*  router.get('/products/search', searchProductController.execute()) */
    router.get('/products/list', products_1.filterListProduct.execute());
    /*  admin */
    router.route('/products')
        .get(products_1.findProductController.execute())
        .post(products_1.createProductController.execute());
    router.route('/products/:id')
        .put(products_1.updateProductController.execute())
        .get(products_1.findProductController.execute())
        .delete(products_1.removeProductController.execute());
};
