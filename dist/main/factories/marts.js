"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinMartController = exports.uploadMartAnnexController = exports.removeMartController = exports.findMartController = exports.updateMartController = exports.createMartController = exports.signUpMartController = exports.authMartController = exports.martSignInController = void 0;
const depedencies_1 = require("./depedencies");
const CreateMart_1 = __importDefault(require("../../data/mart/CreateMart"));
const MartApp_1 = require("../../data/mart/MartApp");
const Login_1 = require("../../presentation/controllers/marts-controllers/Login");
const Crud_1 = require("../../presentation/controllers/marts-controllers/Crud");
const SignUp_1 = require("../../presentation/controllers/marts-controllers/SignUp");
const Join_1 = require("../../presentation/controllers/marts-controllers/Join");
const { martsRepository } = depedencies_1.repositories;
const { encrypter, hasher, idGenerator, mailer, passwordGenerator } = depedencies_1.vendors;
const createMart = new CreateMart_1.default(martsRepository, idGenerator, hasher);
const mrtApp = new MartApp_1.MartApp(martsRepository);
/* Login */
exports.martSignInController = new Login_1.MartsSignInController(martsRepository, encrypter, hasher);
exports.authMartController = new Login_1.AuthMartController();
exports.signUpMartController = new SignUp_1.SignUpMartController(createMart);
/* crud */
exports.createMartController = new Crud_1.CreateMartController(createMart);
exports.updateMartController = new Crud_1.UpdateMartController(createMart);
exports.findMartController = new Crud_1.FindController(mrtApp);
exports.removeMartController = new Crud_1.RemoveController(mrtApp);
/* patch */
exports.uploadMartAnnexController = new SignUp_1.UploadMartAnnexController(martsRepository); //Mart it self
exports.joinMartController = new Join_1.JoinMartController(martsRepository, passwordGenerator, hasher, mailer); //Admin
