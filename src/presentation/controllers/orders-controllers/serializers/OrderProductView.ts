import { OrderModel } from "../../../../domain/entities/OrderModel";
import { ProductModel } from "../../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";
import products from "../../../../main/routes/products";

export type MartLabelView = {
    label: string,
    value: string
}

export interface ProductOrderView extends ProductModel { }

export interface OrderProductView extends OrderModel {
    mart: MartLabelView,
    product: ProductOrderView
}

export const MakeOrderProductView= (martsRepository: DatabaseAdapter, productsRepository: DatabaseAdapter, itemsRepository: DatabaseAdapter) =>{
    return async (order: OrderModel) =>{
        if(!order) return 

        var product = null

        const martResult = !order.mart_id ? null : await martsRepository.find({id: order.mart_id})
        var mart = martResult ? { label: martResult.name, value: martResult.id} : { label: "", value: ""}

        const productAux = await productsRepository.find({id: order.product_id})
        if(productAux){
            product = productAux
        }

        return { ...order, mart, product }
    }
}


