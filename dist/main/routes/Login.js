"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Login_1 = require("../../presentation/controllers/admins-controllers/Login");
const depedencies_1 = require("../factories/depedencies");
const { adminsRepository } = depedencies_1.repositories;
const { encrypter, hasher, idGenerator } = depedencies_1.vendors;
const adminSignInController = new Login_1.AdminSignInController(adminsRepository, encrypter, hasher);
const authController = new Login_1.AuthAdminController();
exports.default = (router) => {
    router.post("/admins/login/signin", adminSignInController.execute());
    router.post("/admins/login/auth", authController.execute());
};
