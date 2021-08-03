"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidForecastDateError = exports.ProductCodeInUseError = exports.CategoryConflictError = exports.ProviderNotFoundError = exports.CategoryNotFoundError = exports.ProductNotFoundError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const ProductNotFoundError = () => (new ApplicationError_1.default('ProductNotFoundError', "Producto não encontrado ", { 'product_id': "Produto não existe" }));
exports.ProductNotFoundError = ProductNotFoundError;
const CategoryNotFoundError = () => (new ApplicationError_1.default('CategoryNotFoundError', "Categoria não encontrada ", { 'category_id': "Categoria referenciada não existe" }));
exports.CategoryNotFoundError = CategoryNotFoundError;
const ProviderNotFoundError = () => (new ApplicationError_1.default('ProviderNotFoundError', "Fornecedor referenciado já não existe ", { 'provider_id': "Fornecedor Desconhecido." }));
exports.ProviderNotFoundError = ProviderNotFoundError;
/* categories */
const CategoryConflictError = () => (new ApplicationError_1.default('CategoryConflictError', "Categoria não pode herdar de si mesmo", { 'category_id': "Categoria não pode herdar de si mesmo" }));
exports.CategoryConflictError = CategoryConflictError;
/*  Products */
const ProductCodeInUseError = (param) => (new ApplicationError_1.default('ProductCodeInUseError', ` ${param} já esta em uso`, { param: ` ${param} já esta em uso` }));
exports.ProductCodeInUseError = ProductCodeInUseError;
const InvalidForecastDateError = () => (new ApplicationError_1.default('InvalidForecastDateError', `Data prevista deve ser posterior a atual`, { forecast: `Data prevista deve ser posterior a atual` }));
exports.InvalidForecastDateError = InvalidForecastDateError;
