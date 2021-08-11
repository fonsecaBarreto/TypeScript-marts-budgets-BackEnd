import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { AccessType, MainController } from "../../helpers/MainController";
import { ProductModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { Create as CreateSchema } from '../../schemas/product-schemas.json'
import { BrandNotFoundError, ProductCodeInUseError, ProductItemNotFoundError, ProductNotFoundError } from "../../../domain/protocols/Errors";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import { ImageTransformer } from "../../../domain/vendors/ImageTransformer";

const ImageSchema: Record<string, FileSchema> = {
    image: {
        optional: true,
        types: ['image/jpeg','image/png','image/webp'],
        max_size: 8e+6,
        multiples: 1
    }
}

export class CreateProductController  extends MainController{
    constructor( 
        private readonly productsRepository: DatabaseAdapter,
        private readonly itemsRepository: DatabaseAdapter,
        private readonly brandsRepository: DatabaseAdapter,
        private readonly idGenerator: IdGenerator,
        private readonly fileRepository: FileRepository,
        private readonly imageTransformer: ImageTransformer,
        private readonly serializer:any,
    ){ super(AccessType.ADMIN, CreateSchema, ImageSchema) }

    private async checkDuplicity( ncm: string, ean: string, sku: string, product?: ProductModel ): Promise<void> {

        if(ncm){
            const ncmExists = await this.productsRepository.find({ ncm })
            if(ncmExists) {
                if( (!product) || product.ncm !== ncm) throw ProductCodeInUseError('ncm')
        }}

        if(ean){
            const eanExists = await this.productsRepository.find({ ean })
            if(eanExists) { 
                if( (!product) || product.ean !== ean) throw ProductCodeInUseError('ean')
        }}

        if(sku){   
            const skuExists = await this.productsRepository.find({ sku })
            if(skuExists) {
                if( (!product) || product.sku !== sku) throw ProductCodeInUseError('sku')
        }}

    }

    async handler(request: Request): Promise<Response> {

        const { description, presentation, brand_id, ncm, ean, sku, item_id } = request.body
        const { image } = request.files

        var image_name = null

        await this.checkDuplicity(ncm, ean, sku)
        
        if(image){

            var altered = await this.imageTransformer.convert({ buffer: image[0].buffer, type: "webp" })
            altered = await this.imageTransformer.resize({ buffer: altered.buffer , dimensions: {width: 320, height: 320 }})
            const fileStored = await this.fileRepository.save({
                buffer: altered.buffer,
                contentType: altered.contentType,
                name: "products/mart_product"  + Date.now()
            })

            image_name = fileStored.name
        }

        if(item_id){   
            const itemExists = await this.itemsRepository.find({id: item_id})
            if(!itemExists) throw ProductItemNotFoundError()
        }

        if(brand_id){
            const brandExists = await this.brandsRepository.find({id: brand_id})
            if(!brandExists) throw BrandNotFoundError()
        }

        const id = await this.idGenerator.generate()


        const productModel: ProductModel = {
            id, description, stock:0, price:0, presentation, brand_id, ncm, ean, sku, item_id, image: image_name
        }

        await this.productsRepository.insert(productModel)
    
        const product = await this.productsRepository.find({id})

        return success(await this.serializer(product))

    }
}
