import { MartModel } from '../entities/MartModel';

export interface martsRepository {
    insert(order: MartModel): Promise<void>
    findById(id:string): Promise<MartModel>
}