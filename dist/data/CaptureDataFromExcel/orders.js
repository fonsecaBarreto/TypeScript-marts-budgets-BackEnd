"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersFromExcel = void 0;
const XlsxAdapter_1 = __importDefault(require("../../libs/XlsxAdapter"));
class OrdersFromExcel {
    constructor(repository, knexConnection) {
        this.repository = repository;
        this.knexConnection = knexConnection;
        this.xlsParser = new XlsxAdapter_1.default({
            "Quantidade": 'quantity',
            "Previsão": "forecast",
            "Produto": "product",
            "Estabelecimento": "mart",
            "REFENCIA_BANCO_DE_DADOS": "id",
        });
    }
    async dbToExcel() {
        const orders = await this.repository.list({});
        var serialized = await Promise.all(orders.map(async (o) => {
            var mart = "";
            var product_str = "";
            if (o.product_id) {
                let product_result = await this.knexConnection('products').where({ id: o.product_id }).first().select(["description", 'item_id', 'brand_id']);
                if (product_result.item_id) {
                    let item_result = await this.knexConnection('product_items').where({ id: product_result.item_id }).first().select("name");
                    product_str = `${item_result.name}, `;
                }
                product_str += product_result.description;
                if (product_result.brand_id) {
                    let brand_result = await this.knexConnection('brands').where({ id: product_result.brand_id }).first().select("name");
                    product_str += ` - ${brand_result.name}`;
                }
            }
            if (o.mart_id) {
                let mart_result = await this.knexConnection('marts').where({ id: o.mart_id }).first();
                mart = mart_result ? mart_result.name : '';
            }
            return { ...o, mart, product: product_str };
        }));
        const xls = this.xlsParser.write({ json: serialized, sheetName: "Ordens" });
        return xls;
    }
    async excelToDb() {
        throw new Error("Method not implemented.");
    }
}
exports.OrdersFromExcel = OrdersFromExcel;
