"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemsScrewView = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class ListItemsScrewView extends MainController_1.MainController {
    constructor(itemsRepository) {
        super(MainController_1.AccessType.MART_OR_ADMIN);
        this.itemsRepository = itemsRepository;
    }
    async handler(request) {
        const limit = 8;
        const text = request.query.v || '';
        const offset = Number(request.query.o) || 0;
        const total = await this.itemsRepository.count({}, 'id');
        var { queryData, queryTotal } = await this.itemsRepository.listAlike(['name'], text, {}, {}, offset, limit);
        const listFeed = {
            total,
            subTotal: queryTotal,
            data: queryData
        };
        return http_helper_1.success(listFeed);
    }
}
exports.ListItemsScrewView = ListItemsScrewView;
