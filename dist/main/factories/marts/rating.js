"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.usecases = exports.serializers = void 0;
const index_1 = require("../dependencies/index");
const CreateRating_1 = require("../../../data/mart/rating/CreateRating");
const rating_1 = require("../../../presentation/controllers/marts-controllers/rating");
const rating_Schema_json_1 = __importDefault(require("./schemas/rating-Schema.json"));
const RatingPrivateView_1 = require("../../../presentation/controllers/marts-controllers/rating/serializers/RatingPrivateView");
const { idGenerator } = index_1.vendors;
const { ratingRepository, martsRepository } = index_1.repositories;
exports.serializers = {
    ratingPrivateView: RatingPrivateView_1.MakeRatingPrivateView(martsRepository)
};
exports.usecases = {
    createRating: new CreateRating_1.CreateRating(idGenerator, ratingRepository),
};
exports.controllers = {
    rate: new rating_1.MakeRatingontroller(rating_Schema_json_1.default, exports.usecases.createRating),
    list: new rating_1.FindRatingController(ratingRepository, exports.serializers.ratingPrivateView)
};
