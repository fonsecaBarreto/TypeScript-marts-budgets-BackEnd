"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suggestions_1 = require("../factories/marts/suggestions");
const rating_1 = require("../factories/marts/rating");
exports.default = (router) => {
    router.route('/suggestions/make')
        .post(suggestions_1.controllers.suggest.execute());
    router.route('/suggestions')
        .get(suggestions_1.controllers.list.execute());
    router.route('/rating/make')
        .post(rating_1.controllers.rate.execute());
    router.route('/rating')
        .get(rating_1.controllers.list.execute());
};
