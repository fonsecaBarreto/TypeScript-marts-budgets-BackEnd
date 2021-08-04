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

export interface ProductView extends ProductModel{
    category: CategoryLabelView
}

export const MakeProductView = (brandsRepository: DatabaseAdapter, categoryRepository: DatabaseAdapter) =>{
    return async (product: ProductModel) =>{
        const categoryResult = !product.category_id ? null : await categoryRepository.find({id: product.category_id})
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id} : { label: "", value: ""}

        const brandResult = !product.brand_id ? null : await brandsRepository.find({id: product.brand_id})
        const brand = brandResult ? { label: brandResult.name, value: brandResult.id} : { label: "", value: ""}

        return { ...product, category, brand }
    }
}


//create a Productview Serializer