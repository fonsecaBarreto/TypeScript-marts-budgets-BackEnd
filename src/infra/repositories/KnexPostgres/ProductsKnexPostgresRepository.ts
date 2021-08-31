import { ProductModel } from "../../../domain/entities/ProductModel";
import { OrdersRepository } from "../../../domain/repositories/odersRepository";
import { productsRepository } from "../../../domain/repositories/productRepository";
import KnexAdapter from '../../../libs/KnexAdapter'

export class ProductsKnexPostgresRepository implements productsRepository {
    private readonly table:string = "products"
    constructor( ){}

    async insert(product:ProductModel): Promise<any> {
        const created_at = new Date()
        const updated_at = created_at
        await KnexAdapter.connection(this.table).insert({ ...product, created_at, updated_at}) 
        return
    }
    findById(id:string): Promise<ProductModel> {
         return KnexAdapter.connection(this.table).where({id}).select().first()
    }
}


