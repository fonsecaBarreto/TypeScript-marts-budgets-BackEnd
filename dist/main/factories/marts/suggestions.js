"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.usecases = exports.serializers = exports.SuggestionItemValidator = void 0;
const index_1 = require("../dependencies/index");
const CreateSuggestion_1 = require("../../../data/mart/suggestions/CreateSuggestion");
const checkList_1 = require("./checkList");
const suggestions_1 = require("../../../presentation/controllers/marts-controllers/suggestions");
const suggestionPrivateView_1 = require("../../../presentation/controllers/marts-controllers/suggestions/serializers/suggestionPrivateView");
const suggestion_Schema_json_1 = require("./schemas/suggestion-Schema.json");
const JsonValidator_1 = __importDefault(require("../../../libs/JsonValidator"));
const suggestionSchema = suggestion_Schema_json_1.suggestion;
const itemSchema = suggestion_Schema_json_1.item;
const { idGenerator } = index_1.vendors;
const { suggestionsRepository, martsRepository } = index_1.repositories;
exports.SuggestionItemValidator = new JsonValidator_1.default(itemSchema);
exports.serializers = {
    suggestionPrivateView: suggestionPrivateView_1.MakeSuggestionPrivateView(martsRepository)
};
exports.usecases = {
    createsuggestion: new CreateSuggestion_1.CreateSuggestion(idGenerator, suggestionsRepository),
};
exports.controllers = {
    suggest: new suggestions_1.MakeSuggestionController(suggestionSchema, exports.SuggestionItemValidator, exports.usecases.createsuggestion, checkList_1.usecases.updateCheckList),
    list: new suggestions_1.FindSuggestionController(suggestionsRepository, exports.serializers.suggestionPrivateView)
};
