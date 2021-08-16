"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimumQuantityError = exports.InvalidForecastDateError = exports.ProductCodeInUseError = exports.CategoryConflictError = exports.ProviderNotFoundError = exports.ProductItemNotFoundError = exports.CategoryNotFoundError = exports.BrandNotFoundError = exports.ProductNotFoundError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const ProductNotFoundError = () => (new ApplicationError_1.default('ProductNotFoundError', "Producto não encontrado ", { 'product_id': "Produto não existe" }));
exports.ProductNotFoundError = ProductNotFoundError;
const BrandNotFoundError = () => (new ApplicationError_1.default('BrandNotFoundError', "Marca não encontrada", { 'brand_id': "Marca não existe" }));
exports.BrandNotFoundError = BrandNotFoundError;
const CategoryNotFoundError = () => (new ApplicationError_1.default('CategoryNotFoundError', "Categoria não encontrada ", { 'category_id': "Categoria referenciada não existe" }));
exports.CategoryNotFoundError = CategoryNotFoundError;
const ProductItemNotFoundError = () => (new ApplicationError_1.default('ProductItemNotFoundError', "Item não encontrada ", { 'item_id': "Item referenciado não existe" }));
exports.ProductItemNotFoundError = ProductItemNotFoundError;
const ProviderNotFoundError = () => (new ApplicationError_1.default('ProviderNotFoundError', "Fornecedor Não encontado ", { 'provider_id': "Fornecedor Desconhecido." }));
exports.ProviderNotFoundError = ProviderNotFoundError;
/* categories */
const CategoryConflictError = () => (new ApplicationError_1.default('CategoryConflictError', "Categoria não pode herdar de si mesmo", { 'category_id': "Categoria não pode herdar de si mesmo" }));
exports.CategoryConflictError = CategoryConflictError;
/*  Products */
const ProductCodeInUseError = (param) => (new ApplicationError_1.default('ProductCodeInUseError', ` ${param} já esta em uso`, { param: ` ${param} já esta em uso` }));
exports.ProductCodeInUseError = ProductCodeInUseError;
/* Orders */
const InvalidForecastDateError = () => (new ApplicationError_1.default('InvalidForecastDateError', `Data prevista deve ser posterior a atual`, { forecast: `Data prevista deve ser posterior a atual` }));
exports.InvalidForecastDateError = InvalidForecastDateError;
const MinimumQuantityError = () => (new ApplicationError_1.default('MinimumQuantityError', `Informe a quantidade desejada`, { quantity: `Informe a quantidade desejada` }));
exports.MinimumQuantityError = MinimumQuantityError;
