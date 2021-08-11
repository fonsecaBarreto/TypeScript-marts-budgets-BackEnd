import { Router } from 'express'
import KnexAdapter from '../../libs/KnexAdapter'
import { ItemsSearchController } from '../../presentation/controllers/ItemsSearchController'
import { ProductsSearchController } from '../../presentation/controllers/ProductsSearchController'

const itemsSearchController = new ItemsSearchController(KnexAdapter.connection)
const productsSearchController = new ProductsSearchController(KnexAdapter.connection)

export default (router: Router) =>{

  /*   router.get('/items/search', itemsSearchController.execute()) */
 /*    router.get('/products/search', productsSearchController.execute()) */

}