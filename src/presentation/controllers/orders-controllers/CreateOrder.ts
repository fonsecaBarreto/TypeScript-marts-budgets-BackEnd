import { OrderModel } from "../../../domain/entities/OrderModel";
import { InvalidForecastDateError, MartNotFoundError, ProductNotFoundError } from "../../../domain/protocols/Errors";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { Create as CreateSchema } from '../../schemas/order-schemas.json'

export default class MakeOrder extends MainController {
    constructor(
        private readonly idGenerator: IdGenerator,
        private readonly ordersRepository: DatabaseAdapter,
        private readonly productsRepository: DatabaseAdapter,
        private readonly martsRepository: DatabaseAdapter,
    ){
        super(AccessType.MART, CreateSchema)
    }
    async handler(request: Request): Promise<Response> {
        
        const { user, body } = request
        const { forecast, quantity, product_id } = body

        const mart_id = user.id

        const martsExists = await this.martsRepository.find({ id: mart_id })
        if(!martsExists) throw MartNotFoundError()

        const productExits = await this.productsRepository.find({ id: product_id })
        if(!productExits) throw ProductNotFoundError()


        console.log(forecast.getTime())

        console.log(Date.now())
        console.log(new Date().getTime())
        console.log("Horas Restantes", Math.floor((forecast.getTime() - Date.now()) / 1000))

        if(forecast.getTime() <= Date.now()) throw InvalidForecastDateError()
        
        const id = await this.idGenerator.generate();

        const order: OrderModel = {  id, forecast, mart_id, product_id, quantity }

        await this.ordersRepository.insert(order)

        const stored = await this.ordersRepository.find({id})

        return success(stored)

    }

}