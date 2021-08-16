"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const Errors_1 = require("../../../domain/protocols/Errors");
class FindController extends MainController_1.MainController {
    constructor(productRepository, serializer) {
        super(MainController_1.AccessType.ADMIN);
        this.productRepository = productRepository;
        this.serializer = serializer;
    }
    async handler(request) {
        const id = request.params.id;
        if (id) {
            const product = await this.productRepository.find({ id });
            return http_helper_1.success(await this.serializer(product));
        }
        else {
            return http_helper_1.success(await this.productRepository.list({}));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(productRepository, fileRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.productRepository = productRepository;
        this.fileRepository = fileRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.productRepository.find({ id });
        if (!exists)
            throw Errors_1.ProductNotFoundError();
        if (exists.image) {
            await this.fileRepository.remove(exists.image);
        }
        await this.productRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
