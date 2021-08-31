import { OrderModel } from "../../src/domain/entities/OrderModel"

export const MakeFakeOrder = (fields?: Partial<OrderModel>): OrderModel =>{
    return ({
        id: 'test_01',
        os: 0,
        quantity: 12,
        forecast: new Date(),
        product_id: 'asdsadsad',
        mart_id: 'testasdasd',
        ...fields
    })
}