import { CategoryModel } from "../../../../domain/entities/ProductModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

export interface CategoryListView extends Pick<CategoryModel,'name' | 'id'> { }

export const MakeCategoryListView= (category: CategoryModel): CategoryListView =>{
    if(!category) return null
    return { id: category.id, name: category.name } 
}

export const MapCategoryListView= (categories: any[]):  Promise<any> =>{
    if(categories.length === 0 ) return Promise.resolve([])
    categories.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
    return Promise.all(categories.map(async (c: CategoryModel )=> {
        return MakeCategoryListView(c)
    })) 
}


export const MapCategoryTreeView= ( categoriesRepository: DatabaseAdapter, categories: any[]):  Promise<any> =>{
    if(categories.length === 0 ) return Promise.resolve([])
    //find ou the childs of ir

    return Promise.all(categories.map(async (c: CategoryModel )=> {
        const children  = await categoriesRepository.list({ category_id: c.id })
        return { ...c, children }
    }))
  
}
