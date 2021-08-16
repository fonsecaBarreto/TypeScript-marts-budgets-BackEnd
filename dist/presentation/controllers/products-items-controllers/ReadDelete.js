"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Errors_1 = require("../../../domain/protocols/Errors");
class FindController extends MainController_1.MainController {
    constructor(itemsRepository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.itemsRepository = itemsRepository;
        this.serializer = serializer;
    }
    async handler(request) {
        const id = request.params.id;
        if (id) {
            const result = await this.itemsRepository.find({ id });
            return http_helper_1.success(await this.serializer(result));
        }
        else {
            return http_helper_1.success(await this.itemsRepository.list({}));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(itemsRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.itemsRepository = itemsRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.itemsRepository.find({ id });
        if (!exists)
            throw Errors_1.ProductItemNotFoundError();
        await this.itemsRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
