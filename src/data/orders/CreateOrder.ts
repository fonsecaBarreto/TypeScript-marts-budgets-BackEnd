import { OrderModel } from '../../domain/entities/OrderModel'
import { InvalidForecastDateError, MartNotFoundError, MinimumQuantityError, ProductNotFoundError } from '../../domain/protocols/Errors'
import { martsRepository, productsRepository, OrdersRepository } from '../../domain/repositories'
import { IdGenerator } from '../../domain/vendors/Utils'

export namespace CreateOrder {
    export type Params = {
        forecast: Date, 
        quantity: number, 
        product_id: string,
        mart_id: string
    }
}

export default class CreateOrder {
    constructor(
        private readonly idGenerator: IdGenerator,
        private readonly ordersRepository: Pick<OrdersRepository, 'findById' | 'findLastOs' | 'insert'>,
        private readonly martsRepository: Pick<martsRepository,'findById'>,
        private readonly productsRepository: Pick<productsRepository,'findById'>
    ){  }

    async checkAvailability(mart_id:string, product_id:string){

        const martsExists = await this.martsRepository.findById(mart_id)
        if(!martsExists) throw MartNotFoundError()

        const productExits = await this.productsRepository.findById(product_id)
        if(!productExits) throw ProductNotFoundError()
    }

    async checkParams(quantity:number, forecast:Date){

        if(quantity < 1 ) { throw MinimumQuantityError() }
        if(forecast.getTime() <= Date.now()) throw InvalidForecastDateError()
    }

    async execute(params: CreateOrder.Params){


        const { quantity, forecast, product_id, mart_id } = params
        
        await this.checkAvailability(mart_id, product_id)

        await this.checkParams(quantity, forecast)

        var os = await this.ordersRepository.findLastOs() + 1

        const id = await this.idGenerator.generate();

        const order: OrderModel = {  id, os, forecast, mart_id, product_id, quantity }

        await this.ordersRepository.insert(order)

        const stored = await this.ordersRepository.findById(id)

        return stored

    }
}