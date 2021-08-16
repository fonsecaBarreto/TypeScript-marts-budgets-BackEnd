"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const items_1 = require("../../main/factories/items");
exports.default = (router) => {
    router.get('/items/search', items_1.itemsSearchController.execute());
};
