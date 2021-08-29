"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeRatingontroller = void 0;
const http_helper_1 = require("../../../helpers/http-helper");
const MainController_1 = require("../../../helpers/MainController");
class MakeRatingontroller extends MainController_1.MainController {
    constructor(ratingSchema, createRating) {
        super(MainController_1.AccessType.MART, ratingSchema);
        this.createRating = createRating;
    }
    async handler(request) {
        const { user, body } = request;
        const stored = await this.createRating.execute({ mart_id: user.id, ...body });
        return http_helper_1.success(stored);
    }
}
exports.MakeRatingontroller = MakeRatingontroller;
