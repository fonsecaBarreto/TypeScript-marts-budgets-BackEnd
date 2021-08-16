"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategoriesScrewView = exports.listCategoriesPrimaries = exports.filterListCategories = exports.listCategoriesTree = exports.removeCategoryController = exports.findCategoryController = exports.updateCategoryController = exports.createCategoryController = void 0;
const depedencies_1 = require("./depedencies");
const Crud_1 = require("../../presentation/controllers/categories-controllers/Crud");
const ListCategories_1 = require("../../presentation/controllers/categories-controllers/ListCategories");
const ListCategoryTree_1 = require("../../presentation/controllers/categories-controllers/ListCategoryTree");
const ListCategoriesPrimaries_1 = require("../../presentation/controllers/categories-controllers/ListCategoriesPrimaries");
const CategoriesInfinityView_1 = require("../../presentation/controllers/categories-controllers/CategoriesInfinityView");
const { categoriesRepository } = depedencies_1.repositories;
const { idGenerator } = depedencies_1.vendors;
/* crud */
exports.createCategoryController = new Crud_1.CreateCategoryController(categoriesRepository, idGenerator);
exports.updateCategoryController = new Crud_1.CreateCategoryController(categoriesRepository, idGenerator);
exports.findCategoryController = new Crud_1.FindController(categoriesRepository);
exports.removeCategoryController = new Crud_1.RemoveController(categoriesRepository);
/*  */
exports.listCategoriesTree = new ListCategoryTree_1.ListCategoriesTree(categoriesRepository);
exports.filterListCategories = new ListCategories_1.FilterListCategories(categoriesRepository);
exports.listCategoriesPrimaries = new ListCategoriesPrimaries_1.ListCategoriePrimaries(categoriesRepository);
/* v2 */
exports.listCategoriesScrewView = new CategoriesInfinityView_1.ListCategoriesScrewView(categoriesRepository);
