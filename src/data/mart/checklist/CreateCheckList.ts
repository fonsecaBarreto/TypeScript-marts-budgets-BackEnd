import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { MartsCheckList } from '../../../domain/entities/MartModel'

export namespace CreateCheckList {
    export type Params = {
        mart_id: string
    }
}

export class CreateCheckList {
    constructor(
        private readonly repository: DatabaseAdapter,
    ){}
    async  execute( params: CreateCheckList.Params ){
        const {  mart_id } = params
        const checkList: MartsCheckList = {
            mart_id,
            access_number: 0,
            first_suggestion: false
        }
        await this.repository.insert(checkList)
        return await this.repository.find({mart_id: mart_id})
    }
}
