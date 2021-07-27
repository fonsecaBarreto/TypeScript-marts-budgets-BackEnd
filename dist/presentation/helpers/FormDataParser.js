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
        const filesBuffer = {};
        const fieldNames = Object.keys(this.fileSchema);
        const multiples = fieldNames.length > 0 ? true : false;
        const formidable = formidable_1.default({ multiples });
        return new Promise((resolve, reject) => {
            formidable.parse(request, async (err, fields, files) => {
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
            formidable.onPart = (part) => {
                if (!part.filename || !part.mime) {
                    formidable.handlePart(part);
                } // all non-files will pass
                if (part.mime && fieldNames.includes(part.name)) {
                    const { max_size, optional, types } = this.fileSchema[part.name];
                    if (!types.includes(part.mime))
                        return reject(Errors_1.InvalidFileBufferError(types, max_size, part.name));
                    var bufferList = [];
                    var totalSize = 0;
                    var form = {
                        buffer: null,
                        contentType: part.mime,
                        size: 0
                    };
                    part.on('data', (buffer) => {
                        bufferList.push(buffer);
                        totalSize += buffer.length;
                        if (totalSize > max_size)
                            return reject(Errors_1.InvalidFileBufferError(types, max_size, part.name));
                    });
                    part.on('end', (data) => {
                        form.buffer = Buffer.concat(bufferList);
                        form.size = form.buffer.length;
                        filesBuffer[part.name] = form;
                    });
                }
            };
        });
    }
}
exports.FormDataParser = FormDataParser;
