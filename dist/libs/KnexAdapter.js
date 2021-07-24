"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexfile = require("../../knexfile");
class KnexAdapter {
    constructor(table) {
        KnexAdapter.connection = knex_1.default(knexfile[KnexAdapter.env]);
        this.table = table;
    }
    static async resetMigrations() {
        await KnexAdapter.connection.migrate.rollback();
        await KnexAdapter.connection.migrate.latest();
    }
    static async open(env) {
        KnexAdapter.env = env;
        KnexAdapter.connection = knex_1.default(knexfile[KnexAdapter.env]);
    }
    static async close() {
        await KnexAdapter.connection.destroy();
        KnexAdapter.connection = null;
    }
    async remove(where) {
        return KnexAdapter.connection(this.table).where(where).del();
    }
    async count(where, key) {
        const result = await KnexAdapter.connection(this.table).where(where || {}).count(key, { as: 'count' }).first();
        if (!result)
            return 0;
        return Number(result.count);
    }
    async find(where, select) {
        return KnexAdapter.connection(this.table).where(where).select(select || []).first();
    }
    async list(where, select, order, limit) {
        if (order) {
            return KnexAdapter.connection(this.table).where(where || {}).select(select || [])
                .orderBy(order, "desc").limit(limit || 10000);
        }
        else {
            return KnexAdapter.connection(this.table).where(where || {}).select(select || []);
        }
    }
    async insert(data) {
        const created_at = new Date();
        const updated_at = created_at;
        return await KnexAdapter.connection(this.table).insert({ ...data, created_at, updated_at });
    }
    async update(where, data) {
        const updated_at = new Date();
        return await KnexAdapter.connection(this.table).where(where).update({ ...data, updated_at });
    }
}
exports.default = KnexAdapter;
KnexAdapter.env = 'test';
