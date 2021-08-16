"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const items_1 = require("../factories/items");
exports.default = (router) => {
    router.get('/items/screw', items_1.listItemsScrewView.execute());
    router.get('/items/list', items_1.filterListItem.execute());
    router.route('/items')
        .get(items_1.findItemController.execute())
        .post(items_1.createItemController.execute());
    router.route('/items/:id')
        .get(items_1.findItemController.execute())
        .delete(items_1.removeItemController.execute())
        .put(items_1.updateItemController.execute());
};
