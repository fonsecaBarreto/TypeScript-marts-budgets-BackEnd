import { Router } from 'express'
import { createCategoryController, findCategoryController,removeCategoryController,updateCategoryController,
listCategoriesTree, filterListCategories,
listCategoriesPrimaries,
listCategoriesScrewView } from '../factories/categories'



export default (router: Router) =>{


    /* mart or admin */


    router.get("/categories/screw", listCategoriesScrewView.execute())

    router.get("/categories/primaries", listCategoriesPrimaries.execute())


    
    /*  admin */


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