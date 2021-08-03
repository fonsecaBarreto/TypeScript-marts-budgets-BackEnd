import { vendors, repositories, fileRepository } from './depedencies'
import { CreateCategoryController, RemoveController,FindController } from '../../presentation/controllers/categories-controllers/Crud'
import { FilterListCategories } from '../../presentation/controllers/categories-controllers/ListCategories'
import { ListCategoriesTree } from '../../presentation/controllers/categories-controllers/ListCategoryTree'
import { ListCategoriePrimaries } from '../../presentation/controllers/categories-controllers/ListCategoriesPrimaries'

const { categoriesRepository } = repositories
const { idGenerator} = vendors
/* crud */
export const createCategoryController = new CreateCategoryController(categoriesRepository, idGenerator)
export const updateCategoryController = new CreateCategoryController(categoriesRepository, idGenerator)
export const findCategoryController = new FindController(categoriesRepository)
export const removeCategoryController = new RemoveController(categoriesRepository)

/*  */

export const listCategoriesTree = new ListCategoriesTree(categoriesRepository)
export const filterListCategories = new FilterListCategories(categoriesRepository)
export const listCategoriesPrimaries = new ListCategoriePrimaries(categoriesRepository)

