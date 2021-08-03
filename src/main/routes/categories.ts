import { Router } from 'express'
import { createCategoryController, findCategoryController,removeCategoryController,updateCategoryController,
listCategoriesTree, filterListCategories,
listCategoriesPrimaries } from '../factories/categories'



export default (router: Router) =>{
    
    /*  admin */

    router.get("/categories/primaries", listCategoriesPrimaries.execute())

    router.get("/categories/list", filterListCategories.execute()) //admin select input

    router.get("/categories/tree", listCategoriesTree.execute()) //admin

    router.route('/categories')
        .get(findCategoryController.execute())
        .post(createCategoryController.execute())

    router.route('/categories/:id')
        .get(findCategoryController.execute())
        .delete(removeCategoryController.execute())
        .put(updateCategoryController.execute())


}