"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveController = exports.FindController = exports.CreateProductController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const product_schemas_json_1 = require("../../schemas/product-schemas.json");
const Errors_1 = require("../../../domain/protocols/Errors");
const ImageSchema = {
    image: {
        optional: true,
        types: ['image/jpeg', 'image/png', 'image/webp'],
        max_size: 8e+6,
    }
};
class CreateProductController extends MainController_1.MainController {
    constructor(productsRepository, categoriesRepository, idGenerator, fileRepository, imageTransformer, serializer) {
        super(MainController_1.AccessType.ADMIN, product_schemas_json_1.Create, ImageSchema);
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.idGenerator = idGenerator;
        this.fileRepository = fileRepository;
        this.imageTransformer = imageTransformer;
        this.serializer = serializer;
    }
    async checkDuplicity(ncm, ean, sku, product) {
        if (ncm) {
            const ncmExists = await this.productsRepository.find({ ncm });
            if (ncmExists) {
                if ((!product) || product.ncm !== ncm)
                    throw Errors_1.ProductCodeInUseError('ncm');
            }
        }
        if (ean) {
            const eanExists = await this.productsRepository.find({ ean });
            if (eanExists) {
                if ((!product) || product.ean !== ean)
                    throw Errors_1.ProductCodeInUseError('ean');
            }
        }
        if (sku) {
            const skuExists = await this.productsRepository.find({ sku });
            if (skuExists) {
                if ((!product) || product.sku !== sku)
                    throw Errors_1.ProductCodeInUseError('sku');
            }
        }
    }
    async handler(request) {
        const product_id = request.params.id;
        const { description, stock, price, presentation, brand, ncm, ean, sku, category_id } = request.body;
        const { image } = request.files;
        var image_name = null;
        if (product_id) {
            const exists = await this.productsRepository.find({ id: product_id });
            if (!exists)
                throw Errors_1.ProductNotFoundError();
            await this.checkDuplicity(ncm, ean, sku, exists);
            image_name = exists.image;
        }
        else {
            await this.checkDuplicity(ncm, ean, sku);
        }
        if (image) {
            var altered = await this.imageTransformer.convert({ buffer: image.buffer, type: "webp" });
            altered = await this.imageTransformer.resize({ buffer: image.buffer, dimensions: { width: 360, height: 360 } });
            const fileStored = await this.fileRepository.save({
                buffer: altered.buffer,
                contentType: altered.contentType,
                name: "products/mart_product" + Date.now()
            });
            if (product_id && image_name) {
                await this.fileRepository.remove(image_name);
            }
            image_name = fileStored.name;
        }
        if (category_id) {
            const categoryExists = await this.categoriesRepository.find({ id: category_id });
            if (!categoryExists)
                throw Errors_1.CategoryNotFoundError();
        }
        const id = product_id ? product_id : await this.idGenerator.generate();
        if (product_id) {
            await this.productsRepository.update({ id }, { description, stock, price, presentation, brand, ncm, ean, sku, category_id, image: image_name });
        }
        else {
            const productModel = {
                id, description, stock, price, presentation, brand, ncm, ean, sku, category_id, image: image_name
            };
            await this.productsRepository.insert(productModel);
        }
        const product = await this.productsRepository.find({ id });
        return http_helper_1.success(await this.serializer(product));
    }
}
exports.CreateProductController = CreateProductController;
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
