"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsFromExcel = void 0;
const XlsxAdapter_1 = __importDefault(require("../../libs/XlsxAdapter"));
class ProductsFromExcel {
    constructor(repository, knexConnection) {
        this.repository = repository;
        this.knexConnection = knexConnection;
        this.xlsParser = new XlsxAdapter_1.default({
            "Item": 'item',
            "Marca": 'brand',
            "Especificação": "description",
            "Apresentação": "presentation",
            "NCM": "ncm",
            "EAN": "ean",
            "SKU": "sku",
            "REFENCIA_BANCO_DE_DADOS": "id",
        });
    }
    async dbToExcel() {
        const products = await this.repository.list({});
        var serialized = await Promise.all(products.map(async (p) => {
            let brand;
            let item;
            if (p.brand_id) {
                let brand_result = await this.knexConnection('brands').where({ id: p.brand_id }).first();
                brand = brand_result ? brand_result.name : '';
            }
            if (p.item_id) {
                let item_result = await this.knexConnection('product_items').where({ id: p.item_id }).first();
                item = item_result ? item_result.name : '';
            }
            return { ...p, brand, item };
        }));
        const xls = this.xlsParser.write({ json: serialized, sheetName: "products" });
        return xls;
    }
    async excelToDb() {
        throw new Error("Method not implemented.");
    }
}
exports.ProductsFromExcel = ProductsFromExcel;
