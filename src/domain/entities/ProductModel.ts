
export interface CategoryModel {
    id: string,
    name: string
}

export interface ProductModel {
    id: string,
    description: string
    presentation:string
    brand:string
    provider:string
    category_id: string
    stock: number
}
