"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("../factories/providers");
exports.default = (router) => {
    /*  admin */
    router.route('/providers')
        .get(providers_1.findProviderController.execute())
        .post(providers_1.createProviderController.execute());
    router.route('/providers/:id')
        .get(providers_1.findProviderController.execute())
        .delete(providers_1.removeProviderController.execute())
        .put(providers_1.updateProviderController.execute());
};
