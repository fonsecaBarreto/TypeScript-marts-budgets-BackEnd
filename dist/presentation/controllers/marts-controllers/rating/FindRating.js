"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindRatingController = void 0;
const http_helper_1 = require("../../../helpers/http-helper");
const MainController_1 = require("../../../helpers/MainController");
const RatingPrivateView_1 = require("./serializers/RatingPrivateView");
class FindRatingController extends MainController_1.MainController {
    constructor(repository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.repository = repository;
        this.serializer = serializer;
    }
    async handler(request) {
        const ratings = await this.repository.list({});
        ratings.sort((a, b) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0));
        return http_helper_1.success(await RatingPrivateView_1.MapRating(ratings, this.serializer));
    }
}
exports.FindRatingController = FindRatingController;
