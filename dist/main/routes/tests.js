"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestController_1 = require("../../presentation/controllers/TestController");
const testController = new TestController_1.TestController();
exports.default = (router) => {
    router.post('/test', testController.execute());
};
