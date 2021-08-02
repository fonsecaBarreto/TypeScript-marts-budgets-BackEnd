import { ProductModel } from "../../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";

export type CategoryLabelView = {
    label: string,
    value: string
}

export interface ProductView extends ProductModel{
    category: CategoryLabelView
}

export const MakeProductView = (productRepository: DatabaseAdapter, categoryRepository: DatabaseAdapter) =>{
    return async (product: ProductModel) =>{
        const categoryResult = !product.category_id ? null : await categoryRepository.find({id: product.category_id})
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id} : { label: "", value: ""}
        return { ...product, category }
    }
}


//create a Productview Serializer