import { Router } from 'express'
import { createProviderController,findProviderController,removeProviderController,updateProviderController} from '../factories/providers'



export default (router: Router) =>{

    /*  admin */
    router.route('/providers')
        .get(findProviderController.execute())
        .post(createProviderController.execute())

    router.route('/providers/:id')
        .get(findProviderController.execute())
        .delete(removeProviderController.execute())
        .put(updateProviderController.execute())

}