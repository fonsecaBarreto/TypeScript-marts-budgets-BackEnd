import { MartsRating } from "../../../domain/entities/MartModel"
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { IdGenerator } from "../../../domain/vendors/Utils"


export namespace CreateRating {

    export type Params = {
        mart_id: string,
        grade:number,
        description: ""
    }
}

export class CreateRating {
    constructor(
        private readonly idGenerator: IdGenerator,
        private readonly repository: DatabaseAdapter,
    ){}
    async  execute( params: CreateRating.Params ){

        const id = await this.idGenerator.generate()
        var {  mart_id, grade, description } = params

        grade = grade > 5 ? 5 : grade < 0 ? 0 : grade
     
        const suggestion: MartsRating = {
            id,
            mart_id,
            grade, 
            description
        }
        await this.repository.insert(suggestion)
        return await this.repository.find({id})
    }
}

 