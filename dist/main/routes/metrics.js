"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Metrics_1 = require("../../presentation/controllers/Metrics");
const KnexAdapter_1 = __importDefault(require("../../libs/KnexAdapter"));
const streamController = new Metrics_1.MetricsController(KnexAdapter_1.default.connection);
exports.default = (router) => {
    router.get('/metrics', streamController.execute());
};
