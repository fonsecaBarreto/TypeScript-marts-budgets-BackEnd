import { Router } from 'express'
import { makeOrder, listOrdersByFilter } from '../factories/orders'



export default (router: Router) =>{


    router.get('/orders/list',listOrdersByFilter.execute())
    /*  admin */
    router.route('/orders/make')
        .post(makeOrder.execute())


}