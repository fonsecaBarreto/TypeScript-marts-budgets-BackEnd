import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { XlsParserAdapter } from "../../domain/vendors/XlsParserAdapter";
import XlsxAdapter from "../../libs/XlsxAdapter";
import { ExcelParser } from "./ExcelParser";

export class ProviderFromExecel implements ExcelParser{
    readonly xlsParser: XlsParserAdapter;
    constructor(
        readonly repository: DatabaseAdapter
    ){
        this.xlsParser = new XlsxAdapter({
            "Nome": "name",
            "Telefone": "phone",
            "E-mail": "email",
            "CNPJ": "cnpj",
            "Razão Social": "corporate_name",
            "obs": "obs",
            "Responsavel": "responsible_name",
            "E-mail financeiro": "financial_email",
        })
     }

    async dbToExcel(): Promise<any> {
        const providers = await this.repository.list({})
        const xls = this.xlsParser.write({json: providers, sheetName: "Fornecedores"})
        return xls
    }
    async excelToDb(): Promise<any> {


        //capture data from excel

        //than it Shoul validate each one of them 

        //save into db


        //return a error to the contorller if somehting went wonrg
        
        // it Should reveice a exel and be able to write on db
        // it got to validate first before to do that
        throw new Error("Method not implemented.");
    }


}