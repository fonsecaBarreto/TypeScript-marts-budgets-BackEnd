"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
class LocalStorage {
    constructor(root_directory) {
        this.root_directory = root_directory;
    }
    async save(params) {
        const { buffer, contentType, name } = params;
        var dir = path_1.default.resolve(`${this.root_directory}`, path_1.default.dirname(name));
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        const ext = mime_types_1.default.extension(contentType);
        const result = `${name}.${ext}`;
        fs_1.default.writeFileSync(`${this.root_directory}/${result}`, buffer);
        return ({ name: result });
    }
    async get(name) {
        const fullpath = path_1.default.join(this.root_directory, name);
        const file = fs_1.default.readFileSync(fullpath);
        const ext = path_1.default.extname(name);
        const stream = fs_1.default.createReadStream(fullpath);
        return { stream, size: file.length, contentType: mime_types_1.default.contentType(ext) };
    }
    async remove(name) {
        const fullpath = path_1.default.join(`${this.root_directory}`, name);
        const exists = fs_1.default.existsSync(fullpath);
        if (!exists)
            return;
        return fs_1.default.rmSync(fullpath, { recursive: true, force: true });
    }
}
exports.default = LocalStorage;
