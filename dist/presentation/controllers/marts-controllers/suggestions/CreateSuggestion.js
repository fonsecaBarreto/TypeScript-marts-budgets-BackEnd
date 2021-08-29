"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeSuggestionController = void 0;
const http_helper_1 = require("../../../helpers/http-helper");
const MainController_1 = require("../../../helpers/MainController");
const CommonErrors_1 = require("../../../../domain/protocols/Errors/CommonErrors");
class MakeSuggestionController extends MainController_1.MainController {
    constructor(suggestionSchema, itemValidator, createSuggestion, updateCheckList) {
        super(MainController_1.AccessType.MART, suggestionSchema);
        this.itemValidator = itemValidator;
        this.createSuggestion = createSuggestion;
        this.updateCheckList = updateCheckList;
    }
    async handler(request) {
        const { user, body, query } = request;
        const items = body === null || body === void 0 ? void 0 : body.items;
        if (!items) {
            await this.updateCheckList.setFirst_suggestions({ mart_id: user.id });
            return http_helper_1.success();
        }
        const itemList = JSON.parse(items);
        if (itemList.length == 0 || !Array.isArray(itemList)) {
            return http_helper_1.badRequest(CommonErrors_1.InvalidRequestBodyError({ 'items': " Informe ao menos uma sugestão" }));
        }
        var itemsErrors = {};
        await Promise.all(itemList.map(async (j, i) => {
            var errors = await this.itemValidator.validate(j);
            if (errors) {
                itemsErrors[i] = errors;
            }
            itemList[i] = j;
        }));
        if (Object.keys(itemsErrors).length > 0) {
            return http_helper_1.badRequest(CommonErrors_1.InvalidRequestBodyError({ 'items': itemsErrors }));
        }
        const stored = await this.createSuggestion.execute({ mart_id: user.id, items: itemList });
        await this.updateCheckList.setFirst_suggestions({ mart_id: user.id });
        return http_helper_1.success(stored);
    }
}
exports.MakeSuggestionController = MakeSuggestionController;
