"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOrder = void 0;
const depedencies_1 = require("./depedencies");
const CreateOrder_1 = __importDefault(require("../../presentation/controllers/orders-controllers/CreateOrder"));
const { martsRepository, productsRepository, ordersRepository } = depedencies_1.repositories;
exports.makeOrder = new CreateOrder_1.default(depedencies_1.vendors.idGenerator, ordersRepository, productsRepository, martsRepository);
