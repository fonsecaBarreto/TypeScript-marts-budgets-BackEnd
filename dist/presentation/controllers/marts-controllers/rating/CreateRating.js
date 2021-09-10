"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeRatingController = void 0;
const http_helper_1 = require("../../../helpers/http-helper");
const MainController_1 = require("../../../helpers/MainController");
class MakeRatingController extends MainController_1.MainController {
    constructor(ratingSchema, createRating, updateCheckList) {
        super(MainController_1.AccessType.MART, ratingSchema);
        this.createRating = createRating;
        this.updateCheckList = updateCheckList;
    }
    async handler(request) {
        const { user, body } = request;
        const stored = await this.createRating.execute({ mart_id: user.id, ...body });
        await this.updateCheckList.setFirst_Rating({ mart_id: user.id });
        return http_helper_1.success(stored);
    }
}
exports.MakeRatingController = MakeRatingController;
