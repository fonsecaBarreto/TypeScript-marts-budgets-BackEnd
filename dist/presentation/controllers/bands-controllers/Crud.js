"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.CreateBrandController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const brand_schema_json_1 = require("../../schemas/brand-schema.json");
const Errors_1 = require("../../../domain/protocols/Errors");
class CreateBrandController extends MainController_1.MainController {
    constructor(brandsRepository, idGenerator) {
        super(MainController_1.AccessType.ADMIN, brand_schema_json_1.Create);
        this.brandsRepository = brandsRepository;
        this.idGenerator = idGenerator;
    }
    async checkDuplicity(name, brand) {
        const nameExists = await this.brandsRepository.find({ name });
        if (nameExists) {
            if ((!brand) || brand.name !== name)
                throw Errors_1.BrandNotFoundError();
        }
    }
    async handler(request) {
        const brand_id = request.params.id;
        const { name } = request.body;
        if (brand_id) {
            const exists = await this.brandsRepository.find({ id: brand_id });
            if (!exists)
                throw Errors_1.BrandNotFoundError();
            await this.checkDuplicity(name, exists);
        }
        else {
            await this.checkDuplicity(name);
        }
        const id = brand_id ? brand_id : await this.idGenerator.generate();
        if (brand_id) {
            await this.brandsRepository.update({ id }, { name });
        }
        else {
            const brandModel = { id, name };
            await this.brandsRepository.insert(brandModel);
        }
        const brand = await this.brandsRepository.find({ id });
        return http_helper_1.success(brand);
    }
}
exports.CreateBrandController = CreateBrandController;
class FindController extends MainController_1.MainController {
    constructor(brandsRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.brandsRepository = brandsRepository;
    }
    async handler(request) {
        const id = request.params.id;
        if (id) {
            const brand = await this.brandsRepository.find({ id });
            return http_helper_1.success(brand);
        }
        else {
            return http_helper_1.success(await this.brandsRepository.list({}));
        }
    }
}
exports.FindController = FindController;
class RemoveController extends MainController_1.MainController {
    constructor(brandsRepository) {
        super(MainController_1.AccessType.ADMIN);
        this.brandsRepository = brandsRepository;
    }
    async handler(request) {
        const id = request.params.id;
        const exists = await this.brandsRepository.find({ id });
        if (!exists)
            throw Errors_1.BrandNotFoundError();
        await this.brandsRepository.remove({ id });
        return http_helper_1.success();
    }
}
exports.RemoveController = RemoveController;
