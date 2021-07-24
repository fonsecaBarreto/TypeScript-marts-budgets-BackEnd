

export interface CategoryModel {
    id: string,
    name: string
    category_id:string
}

export interface Brand {
    id: string,
    name: string
}

export interface Provider {
    id:string,
    name: string
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
