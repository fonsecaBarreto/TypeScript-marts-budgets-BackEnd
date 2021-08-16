"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const http_helper_1 = require("../helpers/http-helper");
const MainController_1 = require("../helpers/MainController");
const annexSchema = {
    annexs: {
        optional: false,
        types: ['image/jpeg', 'image/png', 'application/pdf'],
        max_size: 0.5e+6,
        multiples: 3
    },
};
class TestController extends MainController_1.MainController {
    constructor() {
        super(MainController_1.AccessType.PUBLIC, null, annexSchema);
    }
    async handler(request) {
        return http_helper_1.success(request.files);
    }
}
exports.TestController = TestController;
