import { Router } from 'express'
import { makeOrder } from '../factories/orders'



export default (router: Router) =>{

    /*  admin */
    router.route('/orders/make')
        .post(makeOrder.execute())


}