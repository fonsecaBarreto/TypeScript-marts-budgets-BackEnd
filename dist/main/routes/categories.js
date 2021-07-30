"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = require("../factories/categories");
exports.default = (router) => {
    /*  admin */
    router.get("/categories/primaries", categories_1.listPrimaryCategories.execute());
    router.get("/categories/tree", categories_1.listCategoriesTree.execute());
    router.route('/categories')
        .get(categories_1.findCategoryController.execute())
        .post(categories_1.createCategoryController.execute());
    router.route('/categories/:id')
        .get(categories_1.findCategoryController.execute())
        .delete(categories_1.removeCategoryController.execute())
        .put(categories_1.updateCategoryController.execute());
};
