"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrdersByFilter = exports.makeOrder = exports.serializers = void 0;
const depedencies_1 = require("./depedencies");
const CreateOrder_1 = __importDefault(require("../../presentation/controllers/orders-controllers/CreateOrder"));
const ListOrdersByFilter_1 = require("../../presentation/controllers/orders-controllers/ListOrdersByFilter");
const OrderView_1 = require("../../presentation/controllers/orders-controllers/serializers/OrderView");
const KnexAdapter_1 = __importDefault(require("../../libs/KnexAdapter"));
const products_1 = require("./products");
const { martsRepository, productsRepository, ordersRepository } = depedencies_1.repositories;
exports.serializers = {
    orderView: OrderView_1.MakeOrderView(martsRepository),
};
exports.makeOrder = new CreateOrder_1.default(depedencies_1.vendors.idGenerator, ordersRepository, productsRepository, martsRepository);
exports.listOrdersByFilter = new ListOrdersByFilter_1.ListOrdersByFilter(KnexAdapter_1.default.connection, products_1.serializers.productView, exports.serializers.orderView);
