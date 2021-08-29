"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usecases = void 0;
const checklist_1 = require("../../../data/mart/checklist");
const index_1 = require("../dependencies/index");
exports.usecases = {
    createCheckList: new checklist_1.CreateCheckList(index_1.repositories.martsChecklistsRepository),
    updateCheckList: new checklist_1.UpdateCheckList(index_1.repositories.martsChecklistsRepository)
};
