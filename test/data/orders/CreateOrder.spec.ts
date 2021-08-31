import CreateOrder, { CreateOrder as CreateOrderNS} from '../../../src/data/orders/CreateOrder'
import { MartModel } from '../../../src/domain/entities/MartModel'
import { OrderModel } from '../../../src/domain/entities/OrderModel'
import { ProductModel } from '../../../src/domain/entities/ProductModel'
import { OrdersRepository, martsRepository, productsRepository } from '../../../src/domain/repositories'
import { IdGenerator } from '../../../src/domain/vendors/Utils'
import { MakeFakeOrder } from '../../stubs/MakeFakeOrder'
import { MakeFakeMart } from '../../stubs/MakeFakeMart'
import { MakeFakeProduct } from '../../stubs/MakeFakeProduct'
import { InvalidForecastDateError, MartNotFoundError, MinimumQuantityError, ProductNotFoundError } from '../../../src/domain/protocols/Errors'

const makeSut = ():any =>{
    class IdGeneratorStub implements IdGenerator {
        async generate(): Promise<string> {
            return 'test_id'
        }
    }
    class OrdersRepositoryStub implements Pick<OrdersRepository, 'findById' | 'findLastOs' | 'insert'> {
        async findById(id: string): Promise<OrderModel> {
            return MakeFakeOrder()
        }
        async findLastOs(): Promise<number> {
            return 0
        }
        async insert(order: OrderModel): Promise<void> {
            return null
        }
    }

    class MartsRepositoryStub implements Pick<martsRepository,'findById'> {
        async findById(id: string): Promise<MartModel> {
            return MakeFakeMart()
        }
    }

    class productsRepositoryStub implements Pick<productsRepository,'findById'> {
        async findById(id: string): Promise<ProductModel> {
            return MakeFakeProduct()
        }
    }

    const idGeneratorStub = new IdGeneratorStub()
    const ordersRepository = new OrdersRepositoryStub()
    const martsRepository = new MartsRepositoryStub()
    const productsRepository = new productsRepositoryStub()
    const sut = new CreateOrder(idGeneratorStub, ordersRepository, martsRepository, productsRepository)
    return { sut, idGeneratorStub, ordersRepository, martsRepository, productsRepository }
}

const makeParams = (fields: Partial<CreateOrderNS.Params>) =>{
    var future = new Date();
    future.setDate(future.getDate() + 30)
    return (
        {
            forecast: future,
            quantity: 2, 
            product_id: "id do produto",
            mart_id: 'id do estabelecimento',
            ...fields
        }
    )
}
describe('Create Order', () =>{
    describe('checkAvailability', () =>{
        test("Should receive correct values", async () =>{
            const {sut} = makeSut()
            const spy = jest.spyOn(sut,'checkAvailability')
            await sut.execute(makeParams({product_id:"produto_test",mart_id:"mercado_test"}))
            expect(spy).toHaveBeenLastCalledWith("mercado_test","produto_test")
        })
        test("Should throw error if marts wasnt founded", async () =>{
            const {sut, martsRepository } = makeSut()
            jest.spyOn(martsRepository,'findById').mockImplementation(()=>{ return Promise.resolve(null)})
            var result = sut.execute(makeParams({product_id:"produto_test",mart_id:"mercado_test"}))
            await expect(result).rejects.toThrow(MartNotFoundError())
        })
        test("Should throw error if product wasnt founded", async () =>{
            const {sut, productsRepository } = makeSut()
            jest.spyOn(productsRepository,'findById').mockImplementation(()=>{ return Promise.resolve(null)})
            var result = sut.execute(makeParams({product_id:"produto_test",mart_id:"mercado_test"}))
            await expect(result).rejects.toThrow(ProductNotFoundError())
        })
    })
    describe('CheckParams', () =>{
        test("Should receive correct values", async () =>{
            const {sut} = makeSut()
            var future = new Date();
            future.setDate(future.getDate() + 15)
            const spy = jest.spyOn(sut,'checkParams')
            await sut.execute(makeParams({quantity:5,forecast:future}))
            expect(spy).toHaveBeenCalledWith(5, future)
        })

        test("Should throw error if lower quantity", async () =>{
            const {sut} = makeSut()
            const result=  sut.execute(makeParams({quantity:0}))
            await expect(result).rejects.toThrow(MinimumQuantityError())
        })
        test("Should throw error if lower date", async () =>{
            const {sut } = makeSut()
            var past = new Date();
            past.setDate(past.getDate() - 15)
            const result = sut.execute(makeParams({quantity:5,forecast:past}))
            await expect(result).rejects.toThrow(InvalidForecastDateError())
        })
    })

    describe('InsertData', () =>{
        test("Should receive value correctly", async () =>{
            const {sut, ordersRepository} = makeSut()
            const insertSpy = jest.spyOn(ordersRepository,'insert')

            var future = new Date();
            future.setDate(future.getDate() + 10)

            await sut.execute(makeParams({quantity:6,forecast:future, product_id:"produto_test",mart_id:"mercado_test"}))

            expect(insertSpy).toHaveBeenCalledWith({
                id:'test_id',
                os: 1, 
                forecast: future ,
                mart_id: 'mercado_test', 
                product_id:  'produto_test', 
                quantity: 6 
            })
        })

     
    })


    describe('Shoudl do ok', () =>{
        test("Should receive data", async () =>{
            const { sut, ordersRepository } = makeSut()

            var future = new Date();
            future.setDate(future.getDate() + 15)

            jest.spyOn(ordersRepository,'findById').mockImplementation( async ()=>{
                return MakeFakeOrder({
                    id:'test_id',
                    forecast: future,
                    quantity: 5,
                    mart_id:"mart_id",
                    product_id: "product_ic",
                    os: 1})
            })

            const result = await sut.execute( makeParams({quantity:5,forecast:future, product_id:"produto_test",mart_id:"mercado_test"}))
            expect(result).toBeTruthy()
            expect(result).toEqual({
                id:'test_id',
                forecast: future,
                quantity: 5,
                mart_id:"mart_id",
                product_id: "product_ic",
                os: 1
            })
        })

    })
})