import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { XlsParserAdapter } from "../../domain/vendors/XlsParserAdapter";

export interface ExcelParser {
    xlsParser: XlsParserAdapter,
    repository: DatabaseAdapter
    dbToExcel(): Promise<any>
    excelToDb(): Promise<any>
}