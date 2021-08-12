import { Router } from 'express'
import { createBrandController, updateBrandController, findBrandController, removeBrandController,
     listBrandsScrewView, listAllbrands } from '../factories/brands'


export default (router: Router) =>{


    router.get('/brands/list', listAllbrands.execute())

    router.get("/brands/screw", listBrandsScrewView.execute()) 
    /*  admin */

    router.route('/brands')
        .get(findBrandController.execute())
        .post(createBrandController.execute())

    router.route('/brands/:id')
        .get(findBrandController.execute())
        .delete(removeBrandController.execute())
        .put(updateBrandController.execute())


}