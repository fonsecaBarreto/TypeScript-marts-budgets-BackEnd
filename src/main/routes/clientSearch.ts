import { Router } from 'express'
import { itemsSearchController } from '../../main/factories/items'


export default (router: Router) =>{

    router.get('/items/search', itemsSearchController.execute()) 

}