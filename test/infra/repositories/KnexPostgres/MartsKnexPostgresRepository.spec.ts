import { MartsKnexPostgresRepository } from '../../../../src/infra/repositories/KnexPostgres/MartsKnexPostgresRepository'
import KnexAdapter from '../../../../src/libs/KnexAdapter'

import { MakeFakeAddress } from '../../../stubs/MakeFakeAddress'
import { MakeFakeMart } from '../../../stubs/MakeFakeMart'

const makeSut = () =>{
    const sut = new MartsKnexPostgresRepository()
    return sut
}

const initial_addresses = [
    MakeFakeAddress({ id:"add_test_00"}),
    MakeFakeAddress({ id:"add_test_01"}),
    MakeFakeAddress({ id:"add_test_A1"}),
]
const initial_marts = [
    MakeFakeMart({ id:"mart_test_00", address_id:'add_test_00'}),
    MakeFakeMart({ id:"mart_test_01", address_id:'add_test_01'}),
]

const test_marts  = [
    MakeFakeMart({ id:"mart_test_A1", address_id:'add_test_A1'}),
]

describe("Should do ok", () =>{
    beforeAll( async ()=>{
        await KnexAdapter.open('test')
        await KnexAdapter.resetMigrations()
        await KnexAdapter.connection('addresses').insert(initial_addresses)
        await KnexAdapter.connection('marts').insert(initial_marts)
    })

    afterAll( async ()=>{  await KnexAdapter.close()  })

    test("Should insert a Mart", async () => {
        const sut = makeSut()
        await sut.insert(test_marts[0])
        const inserted = await KnexAdapter.connection('marts').where({id: test_marts[0].id})
        expect(inserted).toBeTruthy()
    })

    test("Should find Mart by id", async () => {
        const sut = makeSut()
        var result = await sut.findById(initial_marts[1].id)
        expect(result).toBeTruthy() 
        expect(result).toMatchObject(initial_marts[1])
        expect(result.id).toBe(initial_marts[1].id)
    })

    
})