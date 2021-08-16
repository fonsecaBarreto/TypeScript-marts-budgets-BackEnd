"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const stream_1 = require("stream");
function bufferToStream(buffer) {
    var stream = new stream_1.Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}
class XlsxAdapter {
    constructor(schema) {
        this.schema = schema;
    }
    read(params) {
        var { file, sheetName } = params;
        var schema = this.schema;
        const workbook = xlsx_1.default.read(file);
        if (!workbook.SheetNames.includes(sheetName))
            throw new Error("SheetDoenstExits");
        const sheet = workbook.Sheets[sheetName];
        const json = xlsx_1.default.utils.sheet_to_json(sheet);
        var list = [];
        json.map((col) => {
            var serializedColumn = {};
            Object.keys(schema).map((label) => {
                const key = schema[label];
                serializedColumn[key] = col[label] ? col[label] : null;
            });
            return list.push(serializedColumn);
        });
        return list;
    }
    write(params) {
        const { json, sheetName } = params;
        var data = [];
        json.map((col) => {
            var serializedColumn = {};
            Object.keys(this.schema).map((label) => {
                const key = this.schema[label];
                serializedColumn[label] = col[key];
            });
            data.push(serializedColumn);
        });
        var newWb = xlsx_1.default.utils.book_new();
        var newWs = xlsx_1.default.utils.json_to_sheet(data);
        xlsx_1.default.utils.book_append_sheet(newWb, newWs, sheetName);
        const buffer = xlsx_1.default.write(newWb, { bookType: "xlsx", type: "buffer" });
        const stream = bufferToStream(buffer); // convert buffer to stream
        return { stream, size: buffer.length };
    }
}
exports.default = XlsxAdapter;
