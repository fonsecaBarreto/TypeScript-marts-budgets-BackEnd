"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapSuggestions = exports.MakeSuggestionPrivateView = void 0;
const MakeSuggestionPrivateView = (martsRepo) => {
    return async (suggestion) => {
        if (!suggestion)
            return;
        const { mart_id } = suggestion;
        var mart = null;
        const martExists = await martsRepo.find({ id: mart_id });
        if (martExists) {
            mart = { label: martExists.name, value: martExists.id };
        }
        const novo = ({ ...suggestion, mart });
        return novo;
    };
};
exports.MakeSuggestionPrivateView = MakeSuggestionPrivateView;
const MapSuggestions = (suggestions, serializer) => {
    if (suggestions.length === 0)
        return Promise.resolve([]);
    return Promise.all(suggestions.map(async (s) => {
        return serializer(s);
    }));
};
exports.MapSuggestions = MapSuggestions;
