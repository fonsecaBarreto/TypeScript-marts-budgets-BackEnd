import { ExcelParser } from "../../data/CaptureDataFromExcel/ExcelParser";
import { Request, Response } from "../../domain/protocols/http";
import { download, success } from "../helpers/http-helper";
import { AccessType, MainController } from "../helpers/MainController"
const { Readable } = require('stream');

export class DownloadXlsController extends MainController {
    constructor(
        private readonly excelParser: ExcelParser){
            super(AccessType.ADMIN)
        }
    async handler(request: Request): Promise<Response> {
        const stream = await this.excelParser.dbToExcel()
        return download(stream, { 
            'Content-Disposition': 'attachment; filename="file.xlsx"',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
    }

}