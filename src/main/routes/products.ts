import { Router } from 'express'
import { createProductController, updateProductController, findProductController, removeProductController,
filterListProduct, searchProductController, listAllbrands} from '../factories/products'



export default (router: Router) =>{

    router.get('/products/brands', listAllbrands.execute())

    router.get('/products/search', searchProductController.execute())

    router.get('/products/list', filterListProduct.execute())
    /*  admin */
    router.route('/products')
        .get(findProductController.execute())
        .post(createProductController.execute())

    router.route('/products/:id')
        .put(updateProductController.execute())
        .get(findProductController.execute())
        .delete(removeProductController.execute())

}