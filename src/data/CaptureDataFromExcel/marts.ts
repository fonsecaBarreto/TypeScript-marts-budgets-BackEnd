import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { XlsParserAdapter } from "../../domain/vendors/XlsParserAdapter";
import XlsxAdapter from "../../libs/XlsxAdapter";
import { ExcelParser } from "./ExcelParser";

export class MartsFromExcel implements ExcelParser{
    readonly xlsParser: XlsParserAdapter;
    constructor(
        readonly repository: DatabaseAdapter
    ){
        this.xlsParser = new XlsxAdapter({
            "Nome": "name",
            "Telefone": "phone",
            "E-mail": "email",
            "CNPJ": "cnpj_cpf",
            "Razão Social": "corporate_name",
            "Responsavel": "responsible_name",
            "E-mail financeiro": "financial_email",
            "REFENCIA_BANCO_DE_DADOS": "id", 
        })
     }

    async dbToExcel(): Promise<any> {
        const marts = await this.repository.list({})
        const xls = this.xlsParser.write({json: marts, sheetName: "Estabelecimentos"})
        return xls
    }
    async excelToDb(): Promise<any> {

        throw new Error("Method not implemented.");
    }
}