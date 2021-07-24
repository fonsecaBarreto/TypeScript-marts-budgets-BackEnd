"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryNotFound = exports.ProductNotFoundError = void 0;
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const ProductNotFoundError = () => (new ApplicationError_1.default('ProductNotFoundError', "Producto não encontrado ", { 'product_id': "Produto não existe" }));
exports.ProductNotFoundError = ProductNotFoundError;
const CategoryNotFound = () => (new ApplicationError_1.default('CategoryNotFound', "Categoria não encontrada ", { 'category_id': "Categoria referenciada não existe" }));
exports.CategoryNotFound = CategoryNotFound;
