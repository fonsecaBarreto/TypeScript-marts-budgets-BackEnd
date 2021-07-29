import { vendors, repositories, fileRepository } from './depedencies'
import { CreateCategoryController, RemoveController,FindController } from '../../presentation/controllers/categories-controllers/Crud'
import { ListPrimaryCategories, ListCategoriesTree } from '../../presentation/controllers/categories-controllers/ListCategories'

const { categoriesRepository } = repositories
const { idGenerator} = vendors
/* crud */
export const createCategoryController = new CreateCategoryController(categoriesRepository, idGenerator)
export const updateCategoryController = new CreateCategoryController(categoriesRepository, idGenerator)
export const findCategoryController = new FindController(categoriesRepository)
export const removeCategoryController = new RemoveController(categoriesRepository)

/*  */

export const listPrimaryCategories = new ListPrimaryCategories(categoriesRepository)
export const listCategoriesTree = new ListCategoriesTree(categoriesRepository)

