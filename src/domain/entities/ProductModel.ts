

export interface CategoryModel {
    id: string,
    name: string
    category_id:string
}

export interface ProviderModel {
    id:string,
    name: string
    phone: string,
    email: string
}

export interface ProductModel {
    id: string,
    description: string
    presentation:string
    stock: number
    price: number
    ncm:string,
    ean: string,
    sku:string,
    image: string
    brand_id:string
    provider_id:string
    category_id: string
}
