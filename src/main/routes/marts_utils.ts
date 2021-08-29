import { Router } from 'express'
import { controllers } from '../factories/marts/suggestions'
import { controllers as ratingController } from '../factories/marts/rating'



export default (router: Router) =>{

    /*  admin */
    router.route('/suggestions/make')
        .post(controllers.suggest.execute())

    router.route('/suggestions')
        .get(controllers.list.execute())


    /* rakear aqui */
    router.route('/rating/make')
        .post(ratingController.rate.execute())

    router.route('/rating')
        .get(ratingController.list.execute())

        
}