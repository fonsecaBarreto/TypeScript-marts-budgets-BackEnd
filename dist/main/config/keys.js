"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.default = {
    node_env: process.env.NODE_ENV || 'test',
    port: process.env.PORT || 9000,
    jwt_secret: process.env.JWT_ECRET || 'test_secret',
    email_address: process.env.EMAIL_ADDRESS,
    email_password: process.env.EMAIL_PASSWORD,
};
