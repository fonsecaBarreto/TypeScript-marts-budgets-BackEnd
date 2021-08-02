"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListProvider = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class FilterListProvider extends MainController_1.MainController {
    constructor(providersRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.providersRepository = providersRepository;
    }
    async handler(request) {
        const text = request.query.v || '';
        const offset = Number(request.query.o) || 0;
        const total = await this.providersRepository.count({}, 'id');
        const { queryData, queryTotal } = await this.providersRepository.listAlike(['name', 'email', 'phone'], text, {}, {}, offset, 16);
        const providerListFeed = {
            total,
            subTotal: queryTotal,
            queries: { text: text },
            data: queryData,
        };
        return http_helper_1.success(providerListFeed);
    }
}
exports.FilterListProvider = FilterListProvider;
