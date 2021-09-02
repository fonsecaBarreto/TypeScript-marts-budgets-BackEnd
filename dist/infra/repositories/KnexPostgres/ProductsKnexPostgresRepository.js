"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsKnexPostgresRepository = void 0;
const KnexAdapter_1 = __importDefault(require("../../../libs/KnexAdapter"));
class ProductsKnexPostgresRepository {
    constructor() {
        this.table = "products";
    }
    async insert(product) {
        const created_at = new Date();
        const updated_at = created_at;
        await KnexAdapter_1.default.connection(this.table).insert({ ...product, created_at, updated_at });
        return;
    }
    findById(id) {
        return KnexAdapter_1.default.connection(this.table).where({ id }).select().first();
    }
}
exports.ProductsKnexPostgresRepository = ProductsKnexPostgresRepository;
