import { ProductModel } from "../../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";

export type CategoryLabelView = {
    label: string,
    value: string
}

export type BrandLabelView = {
    label: string,
    value: string
}

export interface ProductSearchView {
    id:string,
    description: string,
    presentation: string,
    image: string,
    category?: CategoryLabelView,
    brand?: BrandLabelView
}

export const MakeProductSearchView = (brandsRepository: DatabaseAdapter, categoryRepository: DatabaseAdapter)=>{
    return async (product: ProductModel):Promise<ProductSearchView>  =>{

        const categoryResult = !product.category_id ? null : await categoryRepository.find({id: product.category_id})
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id} : null

        const brandResult = !product.brand_id ? null : await brandsRepository.find({id: product.brand_id})
        const brand = brandResult ? { label: brandResult.name, value: brandResult.id} : null

        const { id, description, presentation, image } = product

        const model: ProductSearchView = {
            id, description, presentation, image, category, brand
        }
        return model
    }
}

export const mapProductSearchView = (products: ProductModel[], serializer: Function): Promise<any> =>{
    if(!products && products.length === 0) return Promise.resolve([])
    return Promise.all(
        products.map(p=>{
            return serializer(p)
        })
    )
}


//create a Productview Serializer