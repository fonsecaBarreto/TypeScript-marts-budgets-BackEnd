"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListItem = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const FullItemView_1 = require("./serializers/FullItemView");
class FilterListItem extends MainController_1.MainController {
    constructor(itemsRepository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.itemsRepository = itemsRepository;
        this.serializer = serializer;
    }
    async handler(request) {
        const text = request.query.v || '';
        const offset = Number(request.query.o) || 0;
        const total = await this.itemsRepository.count({}, 'id');
        const { queryData, queryTotal } = await this.itemsRepository.listAlike(['name'], text, {}, {}, offset, 8);
        const providerListFeed = {
            total,
            subTotal: queryTotal,
            queries: { text },
            data: await FullItemView_1.mapItems(queryData, this.serializer)
        };
        return http_helper_1.success(providerListFeed);
    }
}
exports.FilterListItem = FilterListItem;
