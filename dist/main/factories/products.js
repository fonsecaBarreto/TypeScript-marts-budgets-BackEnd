"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterListProduct = exports.removeProductController = exports.findProductController = exports.updateProductController = exports.createProductController = exports.serializers = void 0;
const depedencies_1 = require("./depedencies");
const Crud_1 = require("../../presentation/controllers/products-controllers/Crud");
const ListProducts_1 = require("../../presentation/controllers/products-controllers/ListProducts");
const ProductView_1 = require("../../presentation/controllers/products-controllers/serializers/ProductView");
const { productsRepository, categoriesRepository } = depedencies_1.repositories;
const { idGenerator, fileRepository, imageTransformer } = depedencies_1.vendors;
exports.serializers = {
    productView: ProductView_1.MakeProductView(productsRepository, categoriesRepository)
};
/* crud */
exports.createProductController = new Crud_1.CreateProductController(productsRepository, categoriesRepository, idGenerator, fileRepository, imageTransformer, exports.serializers.productView);
exports.updateProductController = new Crud_1.CreateProductController(productsRepository, categoriesRepository, idGenerator, fileRepository, imageTransformer, exports.serializers.productView);
exports.findProductController = new Crud_1.FindController(productsRepository, exports.serializers.productView);
exports.removeProductController = new Crud_1.RemoveController(productsRepository, fileRepository);
exports.filterListProduct = new ListProducts_1.FilterListProduct(productsRepository);
