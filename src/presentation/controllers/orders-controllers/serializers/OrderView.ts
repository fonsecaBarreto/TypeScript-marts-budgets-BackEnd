import { OrderModel } from "../../../../domain/entities/OrderModel";
import { ProductModel } from "../../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";

export type MartLabelView = {
    label: string,
    value: string
}

export interface ProductView extends ProductModel{
    mart: MartLabelView
}

export const MakeOrderView= (martsRepository: DatabaseAdapter) =>{
    return async (order: OrderModel) =>{
        if(!order) return 

        const martResult = !order.mart_id ? null : await martsRepository.find({id: order.mart_id})
        const mart = martResult ? { label: martResult.name, value: martResult.id} : { label: "", value: ""}

        return { ...order, mart }
    }
}


//create a Productview Serializer