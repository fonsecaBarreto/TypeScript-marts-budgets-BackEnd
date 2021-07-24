"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterMiddleWare = exports.CaptureDocuments = exports.CaptureImages = void 0;
const Errors_1 = require("../Errors");
const MulterFactory_1 = require("./MulterFactory");
const COMMON_IMAGES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const COMMON_DOCUMENTS = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf"
];
function CaptureImages() {
    return MulterMiddleWare({ types: COMMON_IMAGES, limit: 10e+6, fieldname: "image" });
}
exports.CaptureImages = CaptureImages;
function CaptureDocuments() {
    return MulterMiddleWare({ types: [...COMMON_DOCUMENTS, ...COMMON_IMAGES], limit: 10e+6, fieldname: "application"
    });
}
exports.CaptureDocuments = CaptureDocuments;
function MulterMiddleWare(params) {
    const { fieldname, limit, types } = params;
    const upload = MulterFactory_1.MakeMulter({ types, limit, fieldname });
    return (req, res) => {
        return new Promise((resolve, reject) => {
            return upload(req, res, (err) => {
                if (err && !req.file)
                    return reject(Errors_1.InvalidFileBufferError(types, limit));
                if (!req.file)
                    return reject(Errors_1.MissingFileBufferError());
                return resolve(req.file);
            });
        });
    };
}
exports.MulterMiddleWare = MulterMiddleWare;
