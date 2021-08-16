"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinMartController = exports.filterListMart = exports.removeMartController = exports.findMartController = exports.updateMartController = exports.createMartController = exports.changePasswordByToken = exports.resetPassword = exports.signUpMartController = exports.authMartController = exports.martSignInController = exports.serializers = void 0;
const depedencies_1 = require("./depedencies");
const CreateMart_1 = __importDefault(require("../../data/mart/CreateMart"));
const MartApp_1 = require("../../data/mart/MartApp");
const Login_1 = require("../../presentation/controllers/marts-controllers/Login");
const Crud_1 = require("../../presentation/controllers/marts-controllers/Crud");
const SignUp_1 = require("../../presentation/controllers/marts-controllers/SignUp");
const Join_1 = require("../../presentation/controllers/marts-controllers/Join");
const ResetPassword_1 = require("../../presentation/controllers/marts-controllers/ResetPassword");
const ListMarts_1 = require("../../presentation/controllers/marts-controllers/ListMarts");
const annexs_1 = require("./annexs");
const address_1 = require("./address");
const Address_Schema_json_1 = __importDefault(require("../../presentation/schemas/Address-Schema.json"));
const JsonValidator_1 = __importDefault(require("../../libs/JsonValidator"));
const MartPrivateView_1 = require("../../presentation/controllers/marts-controllers/serializers/MartPrivateView");
const keys_1 = __importDefault(require("../config/keys"));
const addressValidator = new JsonValidator_1.default(Address_Schema_json_1.default);
const { martsRepository, addressRepository, martannexsRepository } = depedencies_1.repositories;
const { encrypter, hasher, idGenerator, mailer, passwordGenerator } = depedencies_1.vendors;
const createMart = new CreateMart_1.default(martsRepository, idGenerator, hasher, addressRepository);
const mrtApp = new MartApp_1.MartApp(martsRepository);
/* serializers */
exports.serializers = {
    martPrivateView: MartPrivateView_1.MakeMartPrivateView(addressRepository, martannexsRepository)
};
/* Login */
exports.martSignInController = new Login_1.MartsSignInController(martsRepository, encrypter, hasher);
exports.authMartController = new Login_1.AuthMartController();
exports.signUpMartController = new SignUp_1.SignUpMartController(addressValidator, address_1.createAddress, createMart, annexs_1.createAnnex);
exports.resetPassword = new ResetPassword_1.ResetPassword(martsRepository, mailer, encrypter, keys_1.default.react_client);
exports.changePasswordByToken = new ResetPassword_1.ChangePasswordByToken(martsRepository, mailer, encrypter, hasher);
/* crud */
exports.createMartController = new Crud_1.CreateMartController(addressValidator, address_1.createAddress, createMart, exports.serializers.martPrivateView);
exports.updateMartController = new Crud_1.UpdateMartController(createMart, exports.serializers.martPrivateView);
exports.findMartController = new Crud_1.FindController(mrtApp, exports.serializers.martPrivateView);
exports.removeMartController = new Crud_1.RemoveController(martsRepository, addressRepository, martannexsRepository, depedencies_1.fileRepository);
exports.filterListMart = new ListMarts_1.FilterListMart(martsRepository, exports.serializers.martPrivateView);
/* patch */
exports.joinMartController = new Join_1.JoinMartController(martsRepository, passwordGenerator, hasher, mailer); //Admin
