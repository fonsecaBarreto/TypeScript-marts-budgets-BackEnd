"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/* import { json, urlencoded } from 'body-parser' */
const cors_1 = __importDefault(require("cors"));
exports.default = (app) => {
    app.use((req, res, next) => {
        console.log("\nNova Requisição:");
        console.log("  - ", req.method, req.path);
        next();
    });
    app.use(cors_1.default());
    app.use(express_1.json());
    app.use(express_1.urlencoded({ extended: true }));
};
