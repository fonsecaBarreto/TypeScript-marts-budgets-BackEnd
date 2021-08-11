import { CategoryModel } from "../../../../domain/entities/ProductModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

/* treeView */


export interface CategoryTreeView extends Pick<CategoryModel,'name' | 'id'> {
    children: CategoryTreeView[]
    category_name: string;
}

export const MakeCategoryTreeView= async (categoriesRepository: DatabaseAdapter, category: CategoryModel, children: CategoryTreeView[]): Promise<CategoryTreeView> =>{
    if(!category) return null
    const supCategory = await categoriesRepository.find({ id: category?.category_id },['name', 'category_id'])
    return { id: category.id, name: category.name, children, category_name: supCategory?.name } 
}


export const MapCategoryTreeView= ( categoriesRepository: DatabaseAdapter, categories: any[], serializer?: any):  Promise<any> =>{
    if(categories.length === 0 ) return Promise.resolve([])
    return Promise.all(categories.map(async (c: CategoryModel )=> {
        const result  = await categoriesRepository.list({ category_id: c.id })
        var children = await MapCategoryTreeView(categoriesRepository,result, serializer && serializer) 
        return  serializer ? await serializer(categoriesRepository, c, children) : { ...c, children }
    }))
  
}

