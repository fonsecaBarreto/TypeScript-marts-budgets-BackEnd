import { Router } from 'express'
import { listOrdersByFilter, listOrdersLatest } from '../factories/orders'
import { controllers } from '../factories/orders/index'



export default (router: Router) =>{


    router.get('/orders/list',listOrdersByFilter.execute())
    router.get('/orders/latest', listOrdersLatest.execute())
    /*  admin */
    router.route('/orders/make')
        .post(controllers.order.execute())


}