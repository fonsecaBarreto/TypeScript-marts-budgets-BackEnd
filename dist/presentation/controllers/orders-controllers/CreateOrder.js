"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../../../domain/protocols/Errors");
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const order_schemas_json_1 = require("../../schemas/order-schemas.json");
class MakeOrder extends MainController_1.MainController {
    constructor(idGenerator, ordersRepository, productsRepository, martsRepository, orderSerializer, productSerializer) {
        super(MainController_1.AccessType.MART, order_schemas_json_1.Create);
        this.idGenerator = idGenerator;
        this.ordersRepository = ordersRepository;
        this.productsRepository = productsRepository;
        this.martsRepository = martsRepository;
        this.orderSerializer = orderSerializer;
        this.productSerializer = productSerializer;
    }
    async handler(request) {
        const { user, body } = request;
        const { forecast, quantity, product_id } = body;
        if (quantity < 1) {
            throw Errors_1.MinimumQuantityError();
        }
        const mart_id = user.id;
        const martsExists = await this.martsRepository.find({ id: mart_id });
        if (!martsExists)
            throw Errors_1.MartNotFoundError();
        const productExits = await this.productsRepository.find({ id: product_id });
        if (!productExits)
            throw Errors_1.ProductNotFoundError();
        if (forecast.getTime() <= Date.now())
            throw Errors_1.InvalidForecastDateError();
        const id = await this.idGenerator.generate();
        const order = { id, forecast, mart_id, product_id, quantity };
        await this.ordersRepository.insert(order);
        const stored = await this.ordersRepository.find({ id });
        const serialized = await this.orderSerializer(stored);
        var product = await this.productSerializer(serialized.product);
        return http_helper_1.success({ ...serialized, product });
    }
}
exports.default = MakeOrder;
