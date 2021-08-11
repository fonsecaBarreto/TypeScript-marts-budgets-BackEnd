import { Router } from 'express'
import { createItemController, updateItemController, findItemController, removeItemController,
listItemsScrewView, filterListItem } from '../factories/items'



export default (router: Router) =>{

    router.get('/items/screw', listItemsScrewView.execute())

    router.get('/items/list', filterListItem.execute())

    router.route('/items')
        .get(findItemController.execute())
        .post(createItemController.execute())

    router.route('/items/:id')
        .get(findItemController.execute())
        .delete(removeItemController.execute())
        .put(updateItemController.execute())

}