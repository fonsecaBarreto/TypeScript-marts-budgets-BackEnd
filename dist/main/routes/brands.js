"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brands_1 = require("../factories/brands");
exports.default = (router) => {
    router.get('/brands/list', brands_1.listAllbrands.execute());
    router.get("/brands/screw", brands_1.listBrandsScrewView.execute());
    router.route('/brands')
        .get(brands_1.findBrandController.execute())
        .post(brands_1.createBrandController.execute());
    router.route('/brands/:id')
        .get(brands_1.findBrandController.execute())
        .delete(brands_1.removeBrandController.execute())
        .put(brands_1.updateBrandController.execute());
};
