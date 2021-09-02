"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infra = exports.repositories = void 0;
const KnexAdapter_1 = __importDefault(require("../../../libs/KnexAdapter"));
const KnexPostgres_1 = require("../../../infra/repositories/KnexPostgres");
exports.repositories = {
    martsRepository: new KnexAdapter_1.default('marts'),
    providersRepository: new KnexAdapter_1.default('providers'),
    adminsRepository: new KnexAdapter_1.default('admins'),
    categoriesRepository: new KnexAdapter_1.default('categories'),
    productsRepository: new KnexAdapter_1.default('products'),
    ordersRepository: new KnexAdapter_1.default('orders'),
    brandsRepository: new KnexAdapter_1.default('brands'),
    addressRepository: new KnexAdapter_1.default('addresses'),
    martannexsRepository: new KnexAdapter_1.default('mart_annexs'),
    itemsRepository: new KnexAdapter_1.default('product_items'),
    martsChecklistsRepository: new KnexAdapter_1.default('marts_checklists'),
    suggestionsRepository: new KnexAdapter_1.default('suggestions'),
    ratingRepository: new KnexAdapter_1.default('marts_rating')
};
exports.infra = {
    ordersRepository: new KnexPostgres_1.OrdersKnexPostgresRepository(),
    martsRepository: new KnexPostgres_1.MartsKnexPostgresRepository(),
    productsRepository: new KnexPostgres_1.ProductsKnexPostgresRepository()
};
