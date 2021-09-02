"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const order_schemas_json_1 = require("../../schemas/order-schemas.json");
class CreateOrderController extends MainController_1.MainController {
    constructor(createOrder, orderSerializer, productSerializer) {
        super(MainController_1.AccessType.MART, order_schemas_json_1.Create);
        this.createOrder = createOrder;
        this.orderSerializer = orderSerializer;
        this.productSerializer = productSerializer;
    }
    async handler(request) {
        const { user, body } = request;
        const { forecast, quantity, product_id } = body;
        const mart_id = user.id;
        const stored = await this.createOrder.execute({ forecast, quantity, product_id, mart_id });
        const serialized = await this.orderSerializer(stored);
        var product = await this.productSerializer(serialized.product);
        return http_helper_1.success({ ...serialized, product });
    }
}
exports.default = CreateOrderController;
