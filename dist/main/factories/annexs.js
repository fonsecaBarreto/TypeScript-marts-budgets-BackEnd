"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnnex = void 0;
const depedencies_1 = require("./depedencies");
const CreateAnnex_1 = __importDefault(require("../../data/annex/CreateAnnex"));
const { idGenerator, fileRepository } = depedencies_1.vendors;
const { martannexsRepository } = depedencies_1.repositories;
/* usecases */
exports.createAnnex = new CreateAnnex_1.default(idGenerator, fileRepository, martannexsRepository);
