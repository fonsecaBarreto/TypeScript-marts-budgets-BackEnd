"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.serializers = exports.findMart = exports.createMart = void 0;
const keys_1 = __importDefault(require("../../config/keys"));
const index_1 = require("../dependencies/index");
const address_1 = require("./address");
const annexs_1 = require("./annexs");
const checkList_1 = require("./checkList");
const CreateMart_1 = __importDefault(require("../../../data/mart/CreateMart"));
const FindMart_1 = __importDefault(require("../../../data/mart/FindMart"));
const MartPrivateView_1 = require("../../../presentation/controllers/marts-controllers/serializers/MartPrivateView");
const Login_1 = require("../../../presentation/controllers/marts-controllers/Login");
const ResetPassword_1 = require("../../../presentation/controllers/marts-controllers/ResetPassword");
const Crud_1 = require("../../../presentation/controllers/marts-controllers/Crud");
const SignUp_1 = require("../../../presentation/controllers/marts-controllers/SignUp");
const Join_1 = require("../../../presentation/controllers/marts-controllers/Join");
const ListMarts_1 = require("../../../presentation/controllers/marts-controllers/ListMarts");
const schemas_1 = require("./schemas/");
const EmailHooks_1 = require("../EmailHooks");
const { idGenerator, hasher, encrypter, mailer, fileRepository, passwordGenerator } = index_1.vendors;
const { martsRepository, addressRepository, martannexsRepository, martsChecklistsRepository } = index_1.repositories;
exports.createMart = new CreateMart_1.default(martsRepository, idGenerator, hasher, addressRepository, checkList_1.usecases.createCheckList);
exports.findMart = new FindMart_1.default(martsRepository);
exports.serializers = {
    martPrivateView: MartPrivateView_1.MakeMartPrivateView(addressRepository, martannexsRepository, martsChecklistsRepository)
};
exports.controllers = {
    filterList: new ListMarts_1.FilterListMart(martsRepository, exports.serializers.martPrivateView),
    join: new Join_1.JoinMartController(martsRepository, passwordGenerator, hasher, (mart) => {
        EmailHooks_1.martWelcomeEmailHook.execute(mart);
    }),
    crud: {
        create: new Crud_1.CreateMartController(address_1.validator, address_1.usecases.createAddress, exports.createMart, exports.serializers.martPrivateView),
        find: new Crud_1.FindController(exports.findMart, exports.serializers.martPrivateView),
        update: new Crud_1.UpdateMartController(exports.createMart, exports.serializers.martPrivateView),
        remove: new Crud_1.RemoveController(martsRepository, addressRepository, martannexsRepository, fileRepository),
    },
    login: {
        signup: new SignUp_1.SignUpMartController(schemas_1.signUpSchema, schemas_1.signUpfilesSchema, address_1.validator, address_1.usecases.createAddress, exports.createMart, annexs_1.usecases.createAnnex, (mart) => {
            EmailHooks_1.signUpEmailHook.execute(mart);
        }),
        signin: new Login_1.MartsSignInController(martsRepository, encrypter, hasher),
        auth: new Login_1.AuthMartController(checkList_1.usecases.updateCheckList, exports.serializers.martPrivateView),
        resetPassword: new ResetPassword_1.ResetPassword(martsRepository, mailer, encrypter, keys_1.default.react_client),
        changePasswordByToken: new ResetPassword_1.ChangePasswordByToken(martsRepository, mailer, encrypter, hasher),
    }
};
