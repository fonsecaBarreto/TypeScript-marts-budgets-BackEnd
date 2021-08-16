"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadXlsController = void 0;
const http_helper_1 = require("../helpers/http-helper");
const MainController_1 = require("../helpers/MainController");
const { Readable } = require('stream');
class DownloadXlsController extends MainController_1.MainController {
    constructor(excelParser, filename) {
        super(MainController_1.AccessType.ADMIN);
        this.excelParser = excelParser;
        this.filename = filename;
    }
    async handler(request) {
        const { stream, size } = await this.excelParser.dbToExcel();
        console.log(size);
        return http_helper_1.download(stream, {
            'Content-Disposition': `attachment; filename="${this.filename}.xlsx"`,
            'Content-Length': size + '',
            "Transfer-Encoding": "chunked",
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    }
}
exports.DownloadXlsController = DownloadXlsController;
