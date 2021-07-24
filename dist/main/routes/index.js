"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../config/keys"));
const express_1 = require("express");
const fs_1 = require("fs");
exports.default = (app) => {
    const router = express_1.Router();
    app.use('/api', router);
    router.get("/status", (req, res) => {
        return res.json({
            STATUS: "Running",
            PORT: keys_1.default.port,
            ENV: keys_1.default.node_env
        });
    });
    fs_1.readdirSync(__dirname).map(async (file) => {
        const name = file.split('.').slice(0, -1).join('.');
        if (name == "index")
            return;
        (await Promise.resolve().then(() => __importStar(require(`./${file}`)))).default(router);
    });
};
