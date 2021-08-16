import { ExcelParser } from "../../data/CaptureDataFromExcel/ExcelParser";
import { Request, Response } from "../../domain/protocols/http";
import { download, success } from "../helpers/http-helper";
import { AccessType, MainController } from "../helpers/MainController"
const { Readable } = require('stream');

export class DownloadXlsController extends MainController {
    constructor(
        private readonly excelParser: ExcelParser,
        private readonly filename: string){
            super(AccessType.ADMIN)
        }
    async handler(request: Request): Promise<Response> {
        const {stream, size} = await this.excelParser.dbToExcel()

        console.log(size)
        return download(stream, { 
            'Content-Disposition': `attachment; filename="${this.filename}.xlsx"`,
            'Content-Length': size+'',
            "Transfer-Encoding": "chunked",
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
    }

}