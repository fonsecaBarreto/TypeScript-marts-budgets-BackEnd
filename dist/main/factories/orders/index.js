"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.serializers = void 0;
const CreateOrder_1 = __importDefault(require("../../../data/orders/CreateOrder"));
const repositories_1 = require("../dependencies/repositories");
const vendors_1 = require("../dependencies/vendors");
const OrderView_1 = require("../../../presentation/controllers/orders-controllers/serializers/OrderView");
const OrderProductView_1 = require("../../../presentation/controllers/orders-controllers/serializers/OrderProductView");
const CreateOrder_2 = __importDefault(require("../../../presentation/controllers/orders-controllers/CreateOrder"));
const products_1 = require("../products");
const { idGenerator } = vendors_1.vendors;
const { martsRepository, productsRepository, itemsRepository } = repositories_1.repositories;
exports.serializers = {
    orderView: OrderView_1.MakeOrderView(martsRepository),
    orderProductView: OrderProductView_1.MakeOrderProductView(martsRepository, productsRepository, itemsRepository)
};
const createOrder = new CreateOrder_1.default(idGenerator, repositories_1.infra.ordersRepository, repositories_1.infra.martsRepository, repositories_1.infra.productsRepository);
exports.controllers = {
    order: new CreateOrder_2.default(createOrder, exports.serializers.orderProductView, products_1.serializers.productView)
};
