"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdminController = exports.adminSignInController = void 0;
const depedencies_1 = require("./depedencies");
const Login_1 = require("../../presentation/controllers/admins-controllers/Login");
const { adminsRepository } = depedencies_1.repositories;
const { encrypter, hasher, idGenerator } = depedencies_1.vendors;
exports.adminSignInController = new Login_1.AdminSignInController(adminsRepository, encrypter, hasher);
exports.authAdminController = new Login_1.AuthAdminController();
