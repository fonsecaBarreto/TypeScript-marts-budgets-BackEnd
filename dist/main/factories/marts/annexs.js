"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usecases = void 0;
const index_1 = require("../dependencies/index");
const CreateAnnex_1 = __importDefault(require("../../../data/annex/CreateAnnex"));
const { idGenerator, fileRepository } = index_1.vendors;
const { martannexsRepository } = index_1.repositories;
/* usecases */
exports.usecases = {
    createAnnex: new CreateAnnex_1.default(idGenerator, fileRepository, martannexsRepository)
};
