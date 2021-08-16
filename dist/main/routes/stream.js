"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const depedencies_1 = require("../factories/depedencies");
const Authentication_1 = require("../../presentation/helpers/Authentication");
const StreamController_1 = require("../../presentation/controllers/StreamController");
const authenticator = new Authentication_1.AuthenticationHandler(depedencies_1.vendors.encrypter, depedencies_1.repositories.adminsRepository, depedencies_1.repositories.martsRepository, Authentication_1.AccessType.MART_OR_ADMIN);
const streamController = StreamController_1.StreamControler(authenticator, depedencies_1.vendors.fileRepository);
exports.default = (router) => {
    router.get('/files', streamController);
};
