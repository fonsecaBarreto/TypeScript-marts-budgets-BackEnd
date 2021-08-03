"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositories = exports.vendors = exports.sharpAdapter = exports.fileRepository = void 0;
const path_1 = __importDefault(require("path"));
const keys_1 = __importDefault(require("../config/keys"));
const NodeMailerAdapter_1 = __importDefault(require("../../libs/NodeMailerAdapter"));
const SharpAdapter_1 = __importDefault(require("../../libs/Sharp/SharpAdapter"));
const PasswordGeneratorAdapter_1 = __importDefault(require("../../libs/PasswordGeneratorAdapter"));
const UuidAdapter_1 = __importDefault(require("../../libs/UuidAdapter"));
const BcryptAdapter_1 = __importDefault(require("../../libs/BcryptAdapter"));
const KnexAdapter_1 = __importDefault(require("../../libs/KnexAdapter"));
const JsonWebTokenAdapter_1 = __importDefault(require("../../libs/JsonWebTokenAdapter"));
const MainController_1 = require("../../presentation/helpers/MainController");
const LocalFileStorage_1 = __importDefault(require("../../data/LocalFileStorage"));
KnexAdapter_1.default.open(keys_1.default.node_env);
class MailterStub {
    async send(to, subject, html) {
        return console.log(`\nEnviando email para: ${to},
        \nAssunto: ${subject}, 
        \nCorpo: ${html}`);
    }
}
exports.fileRepository = new LocalFileStorage_1.default(path_1.default.join(__dirname, '..', '..', '..', 'uploads', keys_1.default.node_env));
exports.sharpAdapter = new SharpAdapter_1.default();
exports.vendors = {
    imageTransformer: exports.sharpAdapter,
    fileRepository: exports.fileRepository,
    idGenerator: new UuidAdapter_1.default(),
    passwordGenerator: new PasswordGeneratorAdapter_1.default(),
    mailer: keys_1.default.node_env === "development" ? new MailterStub() : new NodeMailerAdapter_1.default(keys_1.default.email_address, keys_1.default.email_password),
    hasher: new BcryptAdapter_1.default(),
    encrypter: new JsonWebTokenAdapter_1.default(keys_1.default.jwt_secret)
};
exports.repositories = {
    martsRepository: new KnexAdapter_1.default('marts'),
    providersRepository: new KnexAdapter_1.default('providers'),
    adminsRepository: new KnexAdapter_1.default('admins'),
    categoriesRepository: new KnexAdapter_1.default('categories'),
    productsRepository: new KnexAdapter_1.default('products'),
    ordersRepository: new KnexAdapter_1.default('orders')
};
MainController_1.MainController.encrypter = exports.vendors.encrypter;
MainController_1.MainController.martRepository = exports.repositories.martsRepository;
MainController_1.MainController.adminRepository = exports.repositories.adminsRepository;
