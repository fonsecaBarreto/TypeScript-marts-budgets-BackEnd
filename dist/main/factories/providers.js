"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProviderController = exports.findProviderController = exports.updateProviderController = exports.createProviderController = void 0;
const depedencies_1 = require("./depedencies");
const Crud_1 = require("../../presentation/controllers/providers-controllers/Crud");
const { providersRepository } = depedencies_1.repositories;
const { idGenerator } = depedencies_1.vendors;
/* crud */
exports.createProviderController = new Crud_1.CreateProviderController(providersRepository, idGenerator);
exports.updateProviderController = new Crud_1.CreateProviderController(providersRepository, idGenerator);
exports.findProviderController = new Crud_1.FindController(providersRepository);
exports.removeProviderController = new Crud_1.RemoveController(providersRepository);
