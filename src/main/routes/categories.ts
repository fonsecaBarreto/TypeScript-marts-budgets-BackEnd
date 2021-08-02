import { Router } from 'express'
import { createCategoryController, findCategoryController,removeCategoryController,updateCategoryController,
listCategoriesTree, filterListCategories } from '../factories/categories'



export default (router: Router) =>{
    
    /*  admin */

    router.get("/categories/list", filterListCategories.execute())

    router.get("/categories/tree", listCategoriesTree.execute())

    router.route('/categories')
        .get(findCategoryController.execute())
        .post(createCategoryController.execute())

    router.route('/categories/:id')
        .get(findCategoryController.execute())
        .delete(removeCategoryController.execute())
        .put(updateCategoryController.execute())


}