"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MartsFromExcel = void 0;
const XlsxAdapter_1 = __importDefault(require("../../libs/XlsxAdapter"));
class MartsFromExcel {
    constructor(repository) {
        this.repository = repository;
        this.xlsParser = new XlsxAdapter_1.default({
            "Nome": "name",
            "Telefone": "phone",
            "E-mail": "email",
            "CNPJ": "cnpj_cpf",
            "Razão Social": "corporate_name",
            "Responsavel": "responsible_name",
            "E-mail financeiro": "financial_email",
            "REFENCIA_BANCO_DE_DADOS": "id",
        });
    }
    async dbToExcel() {
        const marts = await this.repository.list({});
        const xls = this.xlsParser.write({ json: marts, sheetName: "Estabelecimentos" });
        return xls;
    }
    async excelToDb() {
        throw new Error("Method not implemented.");
    }
}
exports.MartsFromExcel = MartsFromExcel;
