import { OrdersKnexPostgresRepository } from '../../../../src/infra/repositories/KnexPostgres/OrdersKnexPostgresRepository'
import KnexAdapter from '../../../../src/libs/KnexAdapter'
import { MakeFakeProduct, makeFakeBrand, makeFakeItem } from '../../../stubs/MakeFakeProduct'
import { MakeFakeOrder } from '../../../stubs/MakeFakeOrder'
import { MakeFakeMart } from '../../../stubs/MakeFakeMart'

const makeSut = () =>{
    const sut = new OrdersKnexPostgresRepository()
    return sut
}

const orders = [
    MakeFakeOrder({os:0, id:"order_test_00", product_id: 'test_product', mart_id:"test_mart"}),
    MakeFakeOrder(MakeFakeOrder({ os:1, id: "order_test_01", product_id: 'test_product', mart_id:"test_mart" })),
    MakeFakeOrder(MakeFakeOrder({ os:2, id: "order_test_02", product_id: 'test_product', mart_id:"test_mart" })),
    MakeFakeOrder(MakeFakeOrder({ os:3, id: "order_test_03", product_id: 'test_product', mart_id:"test_mart" }))
]

describe("Should do ok", () =>{
    beforeAll( async ()=>{
        await KnexAdapter.open('test')
        await KnexAdapter.resetMigrations()
        await KnexAdapter.connection('marts').insert(MakeFakeMart({id:'test_mart'}))
        await KnexAdapter.connection('brands').insert(makeFakeBrand({id:'test_brand'}))
        await KnexAdapter.connection('product_items').insert(makeFakeItem({id:'test_item'}))
        await KnexAdapter.connection('products').insert(MakeFakeProduct({id:"test_product", item_id:"test_item",brand_id:"test_brand"}))
        await KnexAdapter.connection('orders').insert(orders[0])
    })

    afterAll( async ()=>{
        await KnexAdapter.close()
    })

    test("Should insert a order", async () => {
        const sut = makeSut()
        await sut.insert(orders[1])
        const inserted = await KnexAdapter.connection('orders').where({id: orders[1].id})
        expect(inserted).toBeTruthy()
    })

   test("Should find by id", async () => {
        const sut = makeSut()
        var result = await sut.findById(orders[0].id)
        expect(result).toMatchObject(orders[0])
        expect(result.id).toBe(orders[0].id)
        expect(result.os).toBe(orders[0].os)
    })

    test("Should find the last onde", async () => {
        await KnexAdapter.connection('orders').insert(orders[3]) 
        const sut = makeSut()
        var result = await sut.findLastOs()
        expect(result).toBeTruthy()
        expect(result).toBe(orders[3].os)
    }) 
    
})