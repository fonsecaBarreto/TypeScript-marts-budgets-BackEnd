"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Downloadxls_1 = require("../../presentation/controllers/Downloadxls");
const providers_1 = require("../../data/CaptureDataFromExcel/providers");
const marts_1 = require("../../data/CaptureDataFromExcel/marts");
const products_1 = require("../../data/CaptureDataFromExcel/products");
const depedencies_1 = require("../factories/depedencies");
const KnexAdapter_1 = __importDefault(require("../../libs/KnexAdapter"));
/* providers */
const providerFromExecel = new providers_1.ProviderFromExecel(depedencies_1.repositories.providersRepository); //caso de uso
const prividerFormExecelController = new Downloadxls_1.DownloadXlsController(providerFromExecel, 'fornecedores');
/* marts */
const martsFromExcel = new marts_1.MartsFromExcel(depedencies_1.repositories.martsRepository); //caso de uso
const martsFromExcelController = new Downloadxls_1.DownloadXlsController(martsFromExcel, 'Estabelecimentos');
/* products */
const productsFromExcel = new products_1.ProductsFromExcel(depedencies_1.repositories.productsRepository, KnexAdapter_1.default.connection); //caso de uso
const productsFromExcelController = new Downloadxls_1.DownloadXlsController(productsFromExcel, 'Items');
exports.default = (router) => {
    router.get("/data/download/excel/providers", prividerFormExecelController.execute());
    router.get("/data/download/excel/marts", martsFromExcelController.execute());
    router.get("/data/download/excel/products", productsFromExcelController.execute());
};
