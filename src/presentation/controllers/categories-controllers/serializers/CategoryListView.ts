import { CategoryModel } from "../../../../domain/entities/ProductModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

export interface CategoryListView extends Pick<CategoryModel,'name' | 'id'> {
    children: CategoryListView[]
}

export const MakeCategoryListView= (category: CategoryModel, children: CategoryListView[]): CategoryListView =>{
    if(!category) return null
    return { id: category.id, name: category.name, children } 
}

export const MapCategoryTreeListView= async (categoriesRepository: DatabaseAdapter, categories: any[]):  Promise<any> =>{
    return await MapCategoryTreeView(categoriesRepository, categories, MakeCategoryListView)
}

/* tree */
export const MapCategoryTreeView= ( categoriesRepository: DatabaseAdapter, categories: any[], serializer?: any):  Promise<any> =>{
    if(categories.length === 0 ) return Promise.resolve([])
    return Promise.all(categories.map(async (c: CategoryModel )=> {
        const result  = await categoriesRepository.list({ category_id: c.id })
        var children = await MapCategoryTreeView(categoriesRepository,result, serializer && serializer) 

        return  serializer ? serializer(c, children) : { ...c, children }

    }))
  
}
