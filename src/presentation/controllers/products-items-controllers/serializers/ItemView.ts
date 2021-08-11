import { ProductItem } from "../../../../domain/entities/ProductItem";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";

export type CategoryLabelView = {
    label: string,
    value: string
}

export interface ItemView extends ProductItem{
    category: CategoryLabelView
}

export const MakeItemView = (categoryRepository: DatabaseAdapter) =>{
    return async (product: ProductItem) =>{
        if(!product) return
        const categoryResult = !product.category_id ? null : await categoryRepository.find({id: product.category_id})
        const category = categoryResult ? { label: categoryResult.name, value: categoryResult.id} : { label: "", value: ""}


        return { ...product, category }
    }
}
