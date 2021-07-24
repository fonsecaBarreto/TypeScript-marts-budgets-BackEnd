"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterMiddleWare = exports.MakeMulter = void 0;
const Errors_1 = require("../../../domain/protocols/Errors");
const multer = require('multer');
function MakeMulter(params) {
    const { types, limit, fieldname } = params;
    return (multer({
        storage: multer.memoryStorage(),
        fileFilter: function (req, file, callback) {
            if (!types.includes(file.mimetype))
                return (callback({ name: 'FILE_TYPE_INVALID' }, false));
            callback(null, true);
        },
        limits: { fileSize: limit }
    })).single(fieldname);
}
exports.MakeMulter = MakeMulter;
function MulterMiddleWare(params) {
    const { fieldname, limit, types } = params;
    const upload = MakeMulter({ types, limit, fieldname });
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
