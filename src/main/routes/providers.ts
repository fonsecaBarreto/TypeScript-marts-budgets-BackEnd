import { Router } from 'express'
import { createProviderController,findProviderController,removeProviderController,updateProviderController,
filterListProvider, 
updateProvidersAddressController} from '../factories/providers'



export default (router: Router) =>{

    /*  admin */

    router.patch('/providers/address/:id', updateProvidersAddressController.execute()) //it will create a new address to the provider

    router.get('/providers/list', filterListProvider.execute())

    router.route('/providers')
        .get(findProviderController.execute())
        .post(createProviderController.execute())

    router.route('/providers/:id')
        .get(findProviderController.execute())
        .delete(removeProviderController.execute())
        .put(updateProviderController.execute())

}