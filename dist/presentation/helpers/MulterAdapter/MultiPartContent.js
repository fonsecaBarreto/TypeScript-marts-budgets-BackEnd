"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiPartContent = exports.ContentType = void 0;
const MulterFactory_1 = require("./MulterFactory");
const COMMON_IMAGES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const COMMON_DOCUMENTS = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf"
];
const getImage = MulterFactory_1.MulterMiddleWare({ types: COMMON_IMAGES, limit: 10e+6, fieldname: "image" });
const getDocuments = MulterFactory_1.MulterMiddleWare({ types: [...COMMON_DOCUMENTS], limit: 10e+6, fieldname: "documents" });
var ContentType;
(function (ContentType) {
    ContentType[ContentType["IMAGE"] = 0] = "IMAGE";
    ContentType[ContentType["DOCUMENT"] = 1] = "DOCUMENT";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class MultiPartContent {
    constructor(contentType) {
        this.contentType = contentType;
    }
    async execute(request, response) {
        var file;
        switch (this.contentType) {
            case ContentType.DOCUMENT: file = await getDocuments(request, response);
            default: file = await getImage(request, response);
        }
        request.file = file;
        return null;
    }
}
exports.MultiPartContent = MultiPartContent;
