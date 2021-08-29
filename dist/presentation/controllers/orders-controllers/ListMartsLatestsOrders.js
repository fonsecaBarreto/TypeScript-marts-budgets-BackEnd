"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOrdersLatest = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
class ListOrdersLatest extends MainController_1.MainController {
    constructor(knexConnection, orderSerializer, productSerializer) {
        super(MainController_1.AccessType.MART);
        this.knexConnection = knexConnection;
        this.orderSerializer = orderSerializer;
        this.productSerializer = productSerializer;
    }
    async handler(request) {
        const { user } = request;
        const orders = await this.knexConnection('orders').where({ mart_id: user.id }).limit(12).orderBy('created_at', 'desc');
        const serialized = await Promise.all(orders.map(async (j, i) => {
            const os = await this.orderSerializer(j);
            var product = await this.productSerializer(os.product);
            return { ...os, product };
        }));
        return http_helper_1.success(serialized);
    }
}
exports.ListOrdersLatest = ListOrdersLatest;
//
