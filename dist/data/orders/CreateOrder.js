"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../../domain/protocols/Errors");
class CreateOrder {
    constructor(idGenerator, ordersRepository, martsRepository, productsRepository) {
        this.idGenerator = idGenerator;
        this.ordersRepository = ordersRepository;
        this.martsRepository = martsRepository;
        this.productsRepository = productsRepository;
    }
    async checkAvailability(mart_id, product_id) {
        const martsExists = await this.martsRepository.findById(mart_id);
        if (!martsExists)
            throw Errors_1.MartNotFoundError();
        const productExits = await this.productsRepository.findById(product_id);
        if (!productExits)
            throw Errors_1.ProductNotFoundError();
    }
    async checkParams(quantity, forecast) {
        if (quantity < 1) {
            throw Errors_1.MinimumQuantityError();
        }
        if (forecast.getTime() <= Date.now())
            throw Errors_1.InvalidForecastDateError();
    }
    async execute(params) {
        const { quantity, forecast, product_id, mart_id } = params;
        await this.checkAvailability(mart_id, product_id);
        await this.checkParams(quantity, forecast);
        var os = await this.ordersRepository.findLastOs() + 1;
        const id = await this.idGenerator.generate();
        const order = { id, os, forecast, mart_id, product_id, quantity };
        await this.ordersRepository.insert(order);
        const stored = await this.ordersRepository.findById(id);
        return stored;
    }
}
exports.default = CreateOrder;
