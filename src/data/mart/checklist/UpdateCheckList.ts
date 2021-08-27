import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { MartsCheckList } from '../../../domain/entities/MartModel'

export namespace UpdateCheckList {
    export type Params = {
        mart_id: string
    }
}

export class UpdateCheckList {
    constructor(
        private readonly repository: DatabaseAdapter,
    ){}
    async increaseAccessNumber( params: UpdateCheckList.Params ){
        const {  mart_id } = params
        const checkList = await this.repository.find({mart_id})
        if(!checkList) return 
        
        await this.repository.update({ mart_id},{ access_number: checkList.access_number + 1 })
        return await this.repository.find({mart_id: mart_id})
    }
    async setFirst_suggestions( params: UpdateCheckList.Params ){
        const {  mart_id } = params
        const checkList = await this.repository.find({id: mart_id})
        if(!checkList) return 
        await this.repository.update({id: mart_id},{ first_suggestions: true })
        return await this.repository.find({mart_id: mart_id})
    }
}
