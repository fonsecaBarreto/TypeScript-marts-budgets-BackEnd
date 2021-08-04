

export interface CategoryModel {
    id: string,
    name: string
    category_id:string
}

export interface ProviderModel {
    id:string,
    name: string
    phone: string,
    email: string,
    cnpj: string,
    corporate_name:string,
    obs:string,
}

export interface BrandModel {
    id: string,
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
    category_id: string
    brand_id:string
}
