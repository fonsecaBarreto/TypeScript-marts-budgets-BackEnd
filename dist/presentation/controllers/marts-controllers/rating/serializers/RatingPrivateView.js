"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapRating = exports.MakeRatingPrivateView = void 0;
const MakeRatingPrivateView = (martsRepo) => {
    return async (rating) => {
        if (!rating)
            return;
        const { mart_id } = rating;
        var mart = null;
        const martExists = await martsRepo.find({ id: mart_id });
        if (martExists) {
            mart = { label: martExists.name, value: martExists.id };
        }
        const novo = ({ ...rating, mart });
        return novo;
    };
};
exports.MakeRatingPrivateView = MakeRatingPrivateView;
const MapRating = (ratings, serializer) => {
    if (ratings.length === 0)
        return Promise.resolve([]);
    return Promise.all(ratings.map(async (s) => {
        return serializer(s);
    }));
};
exports.MapRating = MapRating;
