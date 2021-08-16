"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListBrandsScrewView = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class ListBrandsScrewView extends MainController_1.MainController {
    constructor(brandsRepository) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
        this.brandsRepository = brandsRepository;
    }
    async handler(request) {
        const limit = 8;
        const text = request.query.v || '';
        const offset = Number(request.query.o) || 0;
        const total = await this.brandsRepository.count({}, 'id');
        var { queryData, queryTotal } = await this.brandsRepository.listAlike(['name'], text, {}, {}, offset, limit);
        const listFeed = {
            total,
            subTotal: queryTotal,
            data: queryData
        };
        return http_helper_1.success(listFeed);
    }
}
exports.ListBrandsScrewView = ListBrandsScrewView;
