"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderFromExecel = void 0;
const XlsxAdapter_1 = __importDefault(require("../../libs/XlsxAdapter"));
class ProviderFromExecel {
    constructor(repository) {
        this.repository = repository;
        this.xlsParser = new XlsxAdapter_1.default({
            "Nome": "name",
            "Telefone": "phone",
            "E-mail": "email",
            "CNPJ": "cnpj",
            "Razão Social": "corporate_name",
            "obs": "obs",
            "Responsavel": "responsible_name",
            "E-mail financeiro": "financial_email",
            "REFENCIA_BANCO_DE_DADOS": "id",
        });
    }
    async dbToExcel() {
        const providers = await this.repository.list({});
        const xls = this.xlsParser.write({ json: providers, sheetName: "Fornecedores" });
        return xls;
    }
    async excelToDb() {
        //capture data from excel
        //than it Shoul validate each one of them 
        //save into db
        //return a error to the contorller if somehting went wonrg
        // it Should reveice a exel and be able to write on db
        // it got to validate first before to do that
        throw new Error("Method not implemented.");
    }
}
exports.ProviderFromExecel = ProviderFromExecel;
