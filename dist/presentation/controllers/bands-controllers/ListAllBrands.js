"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllbrands = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class ListAllbrands extends MainController_1.MainController {
    constructor(brandRepository) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
        this.brandRepository = brandRepository;
    }
    async handler(request) {
        const brands = await this.brandRepository.list({});
        if (brands.length === 0)
            http_helper_1.success(brands);
        return http_helper_1.success(brands);
    }
}
exports.ListAllbrands = ListAllbrands;
