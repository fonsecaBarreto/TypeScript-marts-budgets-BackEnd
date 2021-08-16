"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductController = void 0;
const http_helper_1 = require("../../helpers/http-helper");
const MainController_1 = require("../../helpers/MainController");
const product_schemas_json_1 = require("../../schemas/product-schemas.json");
const Errors_1 = require("../../../domain/protocols/Errors");
const ImageSchema = {
    image: {
        optional: true,
        types: ['image/jpeg', 'image/png', 'image/webp'],
        max_size: 8e+6,
        multiples: 1
    }
};
class CreateProductController extends MainController_1.MainController {
    constructor(productsRepository, itemsRepository, brandsRepository, idGenerator, fileRepository, imageTransformer, serializer) {
        super(MainController_1.AccessType.ADMIN, product_schemas_json_1.Create, ImageSchema);
        this.productsRepository = productsRepository;
        this.itemsRepository = itemsRepository;
        this.brandsRepository = brandsRepository;
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
        const { description, presentation, brand_id, ncm, ean, sku, item_id } = request.body;
        const { image } = request.files;
        var image_name = null;
        await this.checkDuplicity(ncm, ean, sku);
        if (image) {
            var altered = await this.imageTransformer.convert({ buffer: image[0].buffer, type: "webp" });
            altered = await this.imageTransformer.resize({ buffer: altered.buffer, dimensions: { width: 320, height: 320 } });
            const fileStored = await this.fileRepository.save({
                buffer: altered.buffer,
                contentType: altered.contentType,
                name: "products/mart_product" + Date.now()
            });
            image_name = fileStored.name;
        }
        if (item_id) {
            const itemExists = await this.itemsRepository.find({ id: item_id });
            if (!itemExists)
                throw Errors_1.ProductItemNotFoundError();
        }
        if (brand_id) {
            const brandExists = await this.brandsRepository.find({ id: brand_id });
            if (!brandExists)
                throw Errors_1.BrandNotFoundError();
        }
        const id = await this.idGenerator.generate();
        const productModel = {
            id, description, stock: 0, price: 0, presentation, brand_id, ncm, ean, sku, item_id, image: image_name
        };
        await this.productsRepository.insert(productModel);
        const product = await this.productsRepository.find({ id });
        return http_helper_1.success(await this.serializer(product));
    }
}
exports.CreateProductController = CreateProductController;
