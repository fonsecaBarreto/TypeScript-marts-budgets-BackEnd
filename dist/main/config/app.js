"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("./keys"));
const middlewares_1 = __importDefault(require("../config/middlewares"));
const routes_1 = __importDefault(require("../routes"));
const express_1 = __importDefault(require("express"));
require("../factories/index");
const app = express_1.default();
app.set('keys', keys_1.default);
middlewares_1.default(app);
routes_1.default(app);
exports.default = app;
