"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../config/keys"));
const KnexAdapter_1 = __importDefault(require("../../libs/KnexAdapter"));
const MainController_1 = require("../../presentation/helpers/MainController");
const dependencies_1 = require("./dependencies");
const depedencies_1 = require("./depedencies");
KnexAdapter_1.default.open(keys_1.default.node_env);
MainController_1.MainController.encrypter = depedencies_1.vendors.encrypter;
MainController_1.MainController.martRepository = dependencies_1.repositories.martsRepository;
MainController_1.MainController.adminRepository = dependencies_1.repositories.adminsRepository;
