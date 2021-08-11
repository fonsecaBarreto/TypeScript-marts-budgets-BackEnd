import { ProductModel } from "../../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";

export type ItemLabelView = {
    label: string,
    value: string
}

export type BrandLabelView = {
    label: string,
    value: string
}

export interface ProductView extends ProductModel{
    item: ItemLabelView,
    brand: BrandLabelView
}

export const MakeProductView = (brandsRepository: DatabaseAdapter, itemsRepository: DatabaseAdapter) =>{
    return async (product: ProductModel) =>{
        if(!product) return 
        const itemResult = !product.item_id ? null : await itemsRepository.find({id: product.item_id})
        const item = itemResult ? { label: itemResult.name, value: itemResult.id} : { label: "", value: ""}

        const brandResult = !product.brand_id ? null : await brandsRepository.find({id: product.brand_id})
        const brand = brandResult ? { label: brandResult.name, value: brandResult.id} : { label: "", value: ""}

        return { ...product, item, brand }
    }
}


//create a Productview Serializer