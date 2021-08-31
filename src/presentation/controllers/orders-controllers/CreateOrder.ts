import CreateOrder from "../../../data/orders/CreateOrder";
import { OrderModel } from "../../../domain/entities/OrderModel";
import { InvalidForecastDateError, MartNotFoundError, MinimumQuantityError, ProductNotFoundError } from "../../../domain/protocols/Errors";
import { Request, Response } from "../../../domain/protocols/http";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import { Create as CreateSchema } from '../../schemas/order-schemas.json'

export default class CreateOrderController extends MainController {
    constructor(
        private readonly createOrder: CreateOrder,
        private readonly orderSerializer: any,
        private readonly productSerializer: any
    ){
        super(AccessType.MART, CreateSchema)
    }
    async handler(request: Request): Promise<Response> {
        const { user, body } = request
        const { forecast, quantity, product_id } = body
        const mart_id = user.id
        const stored = await this.createOrder.execute({forecast, quantity, product_id, mart_id})
        const serialized = await this.orderSerializer(stored)
        var product = await this.productSerializer(serialized.product) 
        return success({ ...serialized, product})
    }

}