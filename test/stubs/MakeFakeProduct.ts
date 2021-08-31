import { ProductItem } from "../../src/domain/entities/ProductItem"
import { BrandModel, ProductModel } from "../../src/domain/entities/ProductModel"

export const makeFakeBrand = (fields?:Partial<BrandModel>): BrandModel =>({
    id: 'brand_test_id',
    name: "Marca Teste",
    ...fields
})

export const makeFakeItem  = (fields?:Partial<ProductItem>): ProductItem => ({
    id: 'item_test_id',
    name: 'item teste',
    description: 'Descrição do item aqui',
    category_id: null,
    ...fields
})

export const MakeFakeProduct = (fields?:Partial<ProductModel>): ProductModel =>({
    id: 'product_test_id',
    description: 'Produto teste',
    presentation:'string',
    stock:null,
    price: null,
    ncm: null,
    ean: null,
    sku:null,
    image: null,
    item_id: 'item_test',
    brand_id:'brand_test',
    ...fields
})
