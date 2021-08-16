"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllbrands = exports.listBrandsScrewView = exports.removeBrandController = exports.findBrandController = exports.updateBrandController = exports.createBrandController = void 0;
const depedencies_1 = require("./depedencies");
const Crud_1 = require("../../presentation/controllers/bands-controllers/Crud");
const BrandsScrewView_1 = require("../../presentation/controllers/bands-controllers/BrandsScrewView");
const ListAllBrands_1 = require("../../presentation/controllers/bands-controllers/ListAllBrands");
const { brandsRepository } = depedencies_1.repositories;
const { idGenerator } = depedencies_1.vendors;
/* crud */
exports.createBrandController = new Crud_1.CreateBrandController(brandsRepository, idGenerator);
exports.updateBrandController = new Crud_1.CreateBrandController(brandsRepository, idGenerator);
exports.findBrandController = new Crud_1.FindController(brandsRepository);
exports.removeBrandController = new Crud_1.RemoveController(brandsRepository);
exports.listBrandsScrewView = new BrandsScrewView_1.ListBrandsScrewView(brandsRepository);
exports.listAllbrands = new ListAllBrands_1.ListAllbrands(brandsRepository);
