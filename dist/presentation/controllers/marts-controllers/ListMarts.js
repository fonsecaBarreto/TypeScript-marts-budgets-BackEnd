"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterListMart = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const MartPrivateView_1 = require("./serializers/MartPrivateView");
var MartStatus;
(function (MartStatus) {
    MartStatus[MartStatus["all"] = 0] = "all";
    MartStatus[MartStatus["active"] = 1] = "active";
    MartStatus[MartStatus["pending"] = 2] = "pending";
})(MartStatus || (MartStatus = {}));
class FilterListMart extends MainController_1.MainController {
    constructor(martsRepository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.martsRepository = martsRepository;
        this.serializer = serializer;
    }
    async handler(request) {
        const text = request.query.v || '';
        var status = (Number(request.query.s) || 0);
        status = (status > 2 || status < 0) ? 0 : status;
        const offset = Number(request.query.o) || 0;
        const total = await this.martsRepository.count({}, 'id');
        const where = (status === 0 || status === 1) ? {} : { password: null };
        const whereNot = (status === 0 || status === 2) ? {} : { password: null };
        const { queryData, queryTotal } = await this.martsRepository.listAlike(['name', 'email', 'phone'], text, where, whereNot, offset, 16);
        const providerListFeed = {
            total,
            subTotal: queryTotal,
            queries: { text, status },
            data: await MartPrivateView_1.MapMarts(queryData, this.serializer),
        };
        return http_helper_1.success(providerListFeed);
    }
}
exports.FilterListMart = FilterListMart;
