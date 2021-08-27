import { Router } from 'express'
import { controllers } from '../factories/marts/suggestions'



export default (router: Router) =>{

    /*  admin */
    router.route('/suggestions/make')
        .post(controllers.suggest.execute())


}