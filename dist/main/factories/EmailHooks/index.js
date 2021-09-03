"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.martWelcomeEmailHook = exports.signUpEmailHook = void 0;
const keys_1 = __importDefault(require("../../config/keys"));
const marts_mail_hooks_1 = require("../../../presentation/controllers/mail-hooks/marts-mail-hooks");
const dependencies_1 = require("../dependencies");
exports.signUpEmailHook = new marts_mail_hooks_1.SignUpEmailHook(dependencies_1.vendors.mailer, keys_1.default.hook_email, keys_1.default.react_client);
exports.martWelcomeEmailHook = new marts_mail_hooks_1.WelcomEmailEmailHook(dependencies_1.vendors.mailer, keys_1.default.react_client);
