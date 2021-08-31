import { ProductModel } from '../entities/ProductModel';

export interface productsRepository {
    insert(order: ProductModel): Promise<void>
    findById(id:string): Promise<ProductModel>
}