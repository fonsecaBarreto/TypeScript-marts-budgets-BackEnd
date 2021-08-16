"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterListProduct = exports.removeProductController = exports.findProductController = exports.updateProductController = exports.createProductController = exports.serializers = void 0;
const depedencies_1 = require("./depedencies");
const ReadDelete_1 = require("../../presentation/controllers/products-controllers/ReadDelete");
const CreateProduct_1 = require("../../presentation/controllers/products-controllers/CreateProduct");
const UpdateProduct_1 = require("../../presentation/controllers/products-controllers/UpdateProduct");
const ListProducts_1 = require("../../presentation/controllers/products-controllers/ListProducts");
const ProductView_1 = require("../../presentation/controllers/products-controllers/serializers/ProductView");
const { productsRepository, itemsRepository, brandsRepository } = depedencies_1.repositories;
const { idGenerator, fileRepository, imageTransformer } = depedencies_1.vendors;
exports.serializers = {
    productView: ProductView_1.MakeProductView(brandsRepository, itemsRepository)
};
/* crud */
exports.createProductController = new CreateProduct_1.CreateProductController(productsRepository, itemsRepository, brandsRepository, idGenerator, fileRepository, imageTransformer, exports.serializers.productView);
exports.updateProductController = new UpdateProduct_1.UpdateProductController(productsRepository, itemsRepository, brandsRepository, fileRepository, imageTransformer, exports.serializers.productView);
exports.findProductController = new ReadDelete_1.FindController(productsRepository, exports.serializers.productView);
exports.removeProductController = new ReadDelete_1.RemoveController(productsRepository, fileRepository);
exports.filterListProduct = new ListProducts_1.FilterListProduct(productsRepository);
