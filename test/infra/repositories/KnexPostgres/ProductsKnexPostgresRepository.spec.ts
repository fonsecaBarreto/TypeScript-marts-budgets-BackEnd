import { ProductsKnexPostgresRepository } from '../../../../src/infra/repositories/KnexPostgres/ProductsKnexPostgresRepository'
import KnexAdapter from '../../../../src/libs/KnexAdapter'

import { makeFakeItem, MakeFakeProduct, makeFakeBrand } from '../../../stubs/MakeFakeProduct'


const makeSut = () =>{
    const sut = new ProductsKnexPostgresRepository()
    return sut
}

const initial_items = [
    makeFakeItem({ id:"item_test_00"}),
]

const initial_brands = [
    makeFakeBrand({ id:"brand_test_00"}),
]

const initial_products = [
    MakeFakeProduct({ id:"product_test_00", brand_id: 'brand_test_00', item_id:'item_test_00'}),
]

const test_products = [
    MakeFakeProduct({ id:"product_test_A1",  brand_id: 'brand_test_00',  item_id:'item_test_00'}),
]

describe("Should do ok", () =>{
    beforeAll( async ()=>{
        await KnexAdapter.open('test')
        await KnexAdapter.resetMigrations()
        await KnexAdapter.connection('brands').insert(initial_brands)
        await KnexAdapter.connection('product_items').insert(initial_items)
        await KnexAdapter.connection('products').insert(initial_products)
    })

    afterAll( async ()=>{  await KnexAdapter.close()  })

    test("Should insert a Product", async () => {
        const sut = makeSut()
        await sut.insert(test_products[0])
        const inserted = await KnexAdapter.connection('marts').where({id: test_products[0].id})
        expect(inserted).toBeTruthy()
    })

    test("Should find Product by id", async () => {
        const sut = makeSut()
        var result = await sut.findById(initial_products[0].id)
        expect(result).toBeTruthy() 
        expect(result).toMatchObject(initial_products[0])
        expect(result.id).toBe(initial_products[0].id)
    }) 

    
})