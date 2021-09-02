"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendors = exports.sharpAdapter = exports.amazonS3 = exports.fileRepository = void 0;
const path_1 = __importDefault(require("path"));
const keys_1 = __importDefault(require("../../config/keys"));
const LocalFileStorage_1 = __importDefault(require("../../../data/LocalFileStorage"));
const S3FileRepository_1 = __importDefault(require("../../../libs/AWS/S3FileRepository"));
const SharpAdapter_1 = __importDefault(require("../../../libs/Sharp/SharpAdapter"));
const UuidAdapter_1 = __importDefault(require("../../../libs/UuidAdapter"));
const PasswordGeneratorAdapter_1 = __importDefault(require("../../../libs/PasswordGeneratorAdapter"));
const BcryptAdapter_1 = __importDefault(require("../../../libs/BcryptAdapter"));
const JsonWebTokenAdapter_1 = __importDefault(require("../../../libs/JsonWebTokenAdapter"));
const NodeMailerAdapter_1 = __importDefault(require("../../../libs/NodeMailerAdapter"));
const MailerStub_1 = require("./stubs/MailerStub");
exports.fileRepository = new LocalFileStorage_1.default(path_1.default.join(__dirname, '..', '..', '..', 'uploads', keys_1.default.node_env));
exports.amazonS3 = new S3FileRepository_1.default(keys_1.default.aws_uploads_bucket, keys_1.default.aws_access_key, keys_1.default.aws_secret_key, keys_1.default.aws_region);
exports.sharpAdapter = new SharpAdapter_1.default();
exports.vendors = {
    imageTransformer: exports.sharpAdapter,
    idGenerator: new UuidAdapter_1.default(),
    passwordGenerator: new PasswordGeneratorAdapter_1.default(),
    fileRepository: keys_1.default.node_env === "development" ? exports.fileRepository : exports.amazonS3,
    mailer: keys_1.default.node_env === "development" ? new MailerStub_1.MailterStub() : new NodeMailerAdapter_1.default(keys_1.default.email_address, keys_1.default.email_password),
    hasher: new BcryptAdapter_1.default(),
    encrypter: new JsonWebTokenAdapter_1.default(keys_1.default.jwt_secret)
};
