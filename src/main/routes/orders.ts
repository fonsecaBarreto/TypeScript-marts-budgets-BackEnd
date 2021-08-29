import { Router } from 'express'
import { makeOrder, listOrdersByFilter, listOrdersLatest } from '../factories/orders'



export default (router: Router) =>{


    router.get('/orders/list',listOrdersByFilter.execute())
    router.get('/orders/latest', listOrdersLatest.execute())
    /*  admin */
    router.route('/orders/make')
        .post(makeOrder.execute())


}