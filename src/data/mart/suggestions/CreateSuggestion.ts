import { ProductsSuggestions, SuggestionItem } from "../../../domain/entities/ProductSuggestion"
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter"
import { IdGenerator } from "../../../domain/vendors/Utils"


export namespace CreateSuggestion {

    export type Params = {
        mart_id: string,
        items:SuggestionItem[]
    }
}

export class CreateSuggestion {
    constructor(
        private readonly idGenerator: IdGenerator,
        private readonly repository: DatabaseAdapter,
    ){}
    async  execute( params: CreateSuggestion.Params ){

        const id = await this.idGenerator.generate()
        const {  mart_id, items } = params

        const suggestion: ProductsSuggestions = {
            id,
            mart_id,
            items
        }
        await this.repository.insert(suggestion)
        return await this.repository.find({id})
    }
}

 