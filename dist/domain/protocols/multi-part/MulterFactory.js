"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeMulter = void 0;
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
