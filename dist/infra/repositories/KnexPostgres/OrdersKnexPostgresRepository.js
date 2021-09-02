"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersKnexPostgresRepository = void 0;
const KnexAdapter_1 = __importDefault(require("../../../libs/KnexAdapter"));
class OrdersKnexPostgresRepository {
    constructor() {
        this.table = "orders";
    }
    async findLastOs() {
        const lastOrder = await KnexAdapter_1.default.connection(this.table).where({}).select(['os']).orderBy('created_at', "desc").first();
        return (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.os) ? Number(lastOrder.os) : 0;
    }
    async insert(order) {
        const created_at = new Date();
        const updated_at = created_at;
        await KnexAdapter_1.default.connection(this.table).insert({ ...order, created_at, updated_at });
        return;
    }
    findById(id) {
        return KnexAdapter_1.default.connection(this.table).where({ id }).select().first();
    }
}
exports.OrdersKnexPostgresRepository = OrdersKnexPostgresRepository;
