import { MartModel } from "../../../domain/entities/MartModel";
import { martsRepository } from "../../../domain/repositories/martsRepository";
import KnexAdapter from '../../../libs/KnexAdapter'

export class MartsKnexPostgresRepository implements martsRepository {
    private readonly table:string = "marts"
    constructor( ){}

    async insert(order:MartModel): Promise<any> {
        const created_at = new Date()
        const updated_at = created_at
        await KnexAdapter.connection(this.table).insert({ ...order, created_at, updated_at}) 
        return
    }
    
    findById(id:string): Promise<MartModel> {
         return KnexAdapter.connection(this.table).where({id}).select().first()
    }
}