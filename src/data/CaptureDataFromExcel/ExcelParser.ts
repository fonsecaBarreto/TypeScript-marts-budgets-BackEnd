import { Knex } from "knex";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { XlsParserAdapter } from "../../domain/vendors/XlsParserAdapter";

export interface ExcelParser {
    xlsParser: XlsParserAdapter,
    repository: DatabaseAdapter
    knexConnection?: Knex,
    dbToExcel(): Promise<any>
    excelToDb(): Promise<any>
}