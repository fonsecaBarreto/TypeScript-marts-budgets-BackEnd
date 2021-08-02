import { CategoryModel } from "../../../../domain/entities/ProductModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

/* list */

export interface CategoryListView extends Pick<CategoryModel,'name' | 'id'> {
    bread_crumbs: string[],
}

const getFather = async (sup_id:string, categoriesRepository: DatabaseAdapter): Promise<any> =>{
    if(!sup_id) return null
    var bread_crumbs: string[] = []

    const supCategory = await categoriesRepository.find({ id: sup_id },['name', 'category_id'])
    bread_crumbs = [ supCategory.name ]

    const result = await getFather(supCategory.category_id,categoriesRepository)
    if(result) {
        bread_crumbs=[ ...bread_crumbs, result.name ]
    }

    return { ...supCategory, bread_crumbs}
}

export const MakeCategoryListView= async (categoriesRepository: DatabaseAdapter, category: CategoryModel): Promise<CategoryListView> =>{
    if(!category) return null
    const supCategory = await getFather(category.category_id, categoriesRepository)
    return { id: category.id, name: category.name, bread_crumbs: supCategory?.bread_crumbs || [] } 
}

export const MapCategoryListView = ( categoriesRepository: DatabaseAdapter, categories: any[]):  Promise<any> =>{

    if(categories.length === 0 ) return Promise.resolve([])
    return Promise.all(categories.map(async (c: CategoryModel )=> {
        return MakeCategoryListView(categoriesRepository, c)
    }))
    
}


/* tree */
