import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { AccessType, MainController } from "../../helpers/MainController";
import { ProductModel } from "../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { IdGenerator } from "../../../domain/vendors/Utils";

import { Create as CreateSchema, Update as UpdateSchema } from '../../schemas/product-schemas.json'
import { CategoryNotFoundError, ProductCodeInUseError, ProductNotFoundError } from "../../../domain/protocols/Errors";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import { ImageTransformer } from "../../../domain/vendors/ImageTransformer";
import { MakeCategoryListView } from '../categories-controllers/serializers/CategoryListView'
import { ListCategoriesTree } from "../categories-controllers/ListCategories";
import { serialize } from "node:v8";

const ImageSchema: Record<string, FileSchema> = {
    image: {
        optional: true,
        types: ['image/jpeg','image/png','image/webp'],
        max_size: 8e+6,
    }
}

export class CreateProductController  extends MainController{
    constructor( 
        private readonly productsRepository: DatabaseAdapter,
        private readonly categoriesRepository: DatabaseAdapter,
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

        const product_id = request.params.id;

        const { description, stock, price, presentation, brand, ncm, ean, sku, category_id } = request.body
        const { image } = request.files

        var image_name = null

        if(product_id) {
            const exists = await this.productsRepository.find({ id: product_id})
            if(!exists) throw ProductNotFoundError()
            await this.checkDuplicity(ncm, ean, sku, exists)
            image_name = exists.image
        } else {
            await this.checkDuplicity(ncm, ean, sku)
        }

        if(image){

            var altered = await this.imageTransformer.convert({ buffer: image.buffer, type: "webp" })
            altered = await this.imageTransformer.resize({ buffer: image.buffer , dimensions: {width: 360, height: 360 }})
            const fileStored = await this.fileRepository.save({
                buffer: altered.buffer,
                contentType: altered.contentType,
                name: "products/mart_product"  + Date.now()
            })

            if(product_id && image_name){ await this.fileRepository.remove(image_name) }
            image_name = fileStored.name
        }

        if(category_id){   
            const categoryExists = await this.categoriesRepository.find({id: category_id})
            if(!categoryExists) throw CategoryNotFoundError()
        }

        const id = product_id ? product_id : await this.idGenerator.generate()

       

        if(product_id){
            await this.productsRepository.update({id}, {description, stock, price, presentation, brand, ncm, ean, sku, category_id, image: image_name})
        }else{
            const productModel: ProductModel = {
                id, description, stock, price, presentation, brand, ncm, ean, sku, category_id, image: image_name
            }
            await this.productsRepository.insert(productModel)
        }

        const product = await this.productsRepository.find({id})

        return success(await this.serializer(product))

    }
}

export class FindController  extends MainController{
    constructor(  
        private readonly productRepository: DatabaseAdapter, 
        private readonly serializer:any,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
     
        const id = request.params.id
        if(id){
            const product =  await this.productRepository.find({id})
            return success( await this.serializer(product))
           
        }else{
            return success(await this.productRepository.list({}))
        }
    }
}

export class RemoveController  extends MainController{
    constructor(
         private readonly productRepository: DatabaseAdapter,
         private readonly fileRepository: FileRepository
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const id = request.params.id
        
        
        const exists = await this.productRepository.find({id})
        if(!exists) throw ProductNotFoundError()

        if(exists.image){
            await this.fileRepository.remove(exists.image)
        }

        await this.productRepository.remove({id})

        return success()
    }
}


