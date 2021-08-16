"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataParser = void 0;
const formidable_1 = __importDefault(require("formidable"));
const Errors_1 = require("../../domain/protocols/Errors");
class FormDataParser {
    constructor(fileSchema) {
        this.fileSchema = fileSchema;
    }
    execute(request, response) {
        if (!this.fileSchema)
            return null;
        const formidable = formidable_1.default({ multiples: true });
        var filesBuffer = {}; //result
        const fieldNames = Object.keys(this.fileSchema);
        return new Promise((resolve, reject) => {
            formidable.parse(request, async (err, fields) => {
                if (err) {
                    return reject(err);
                }
                request.body = { ...fields };
                request.files = filesBuffer;
                fieldNames.map(fieldName => {
                    const schema = this.fileSchema[fieldName];
                    if (!Object.keys(filesBuffer).includes(fieldName) && schema.optional !== true) {
                        return reject(Errors_1.MissingFileBufferError(fieldName));
                    }
                });
                return resolve(null);
            });
            var partNameCount = {};
            formidable.onPart = (part) => {
                if (!part.filename || !part.mime) {
                    formidable.handlePart(part);
                } // all non-files will pass
                if (part.mime && fieldNames.includes(part.name)) { // Handle files
                    const { max_size, types, multiples } = this.fileSchema[part.name];
                    partNameCount[part.name] = partNameCount[part.name] ? partNameCount[part.name] + 1 : 1;
                    if (partNameCount[part.name] > multiples)
                        return reject(Errors_1.FilesLengthExceedError(part.name, multiples));
                    if (!types.includes(part.mime))
                        return reject(Errors_1.InvalidFileBufferError(types, max_size, part.name, part.filename));
                    var bufferList = [];
                    var totalSize = 0;
                    var form = {
                        buffer: null,
                        contentType: part.mime,
                        size: 0,
                        fileName: part.filename
                    };
                    part.on('data', (buffer) => {
                        bufferList.push(buffer);
                        totalSize += buffer.length;
                        if (totalSize > max_size)
                            return reject(Errors_1.InvalidFileBufferError(types, max_size, part.name, part.filename));
                    });
                    part.on('end', (data) => {
                        var _a;
                        form.buffer = Buffer.concat(bufferList);
                        form.size = form.buffer.length;
                        filesBuffer[part.name] = ((_a = filesBuffer[part.name]) === null || _a === void 0 ? void 0 : _a.length) ? [...filesBuffer[part.name], form] : [form];
                    });
                }
            };
        });
    }
}
exports.FormDataParser = FormDataParser;
