"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSuggestionController = void 0;
const http_helper_1 = require("../../../helpers/http-helper");
const MainController_1 = require("../../../helpers/MainController");
const suggestionPrivateView_1 = require("./serializers/suggestionPrivateView");
class FindSuggestionController extends MainController_1.MainController {
    constructor(repository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.repository = repository;
        this.serializer = serializer;
    }
    async handler(request) {
        const suggestions = await this.repository.list({});
        suggestions.sort((a, b) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0));
        return http_helper_1.success(await suggestionPrivateView_1.MapSuggestions(suggestions, this.serializer));
    }
}
exports.FindSuggestionController = FindSuggestionController;
