import { ProductsSuggestions } from "../../../../../domain/entities/ProductSuggestion"
import { DatabaseAdapter } from "../../../../../domain/vendors/DatabaseAdapter"

export type MartLabelView = {
    label: string,
    value: string
}

export interface SuggestionPrivateView extends ProductsSuggestions {
    mart: MartLabelView
}

export const MakeSuggestionPrivateView = ( martsRepo: DatabaseAdapter ) =>{

    return async (suggestion: ProductsSuggestions): Promise<SuggestionPrivateView> => {
        if(!suggestion) return 

        const { mart_id } = suggestion

        var mart = null
        const martExists = await martsRepo.find({ id: mart_id })
        if(martExists){
            mart = { label: martExists.name, value: martExists.id }
        }

        const novo=  ({ ...suggestion, mart}) 
        return novo
}}

export const MapSuggestions = (suggestions: any[], serializer: any):  Promise<any> =>{
    if(suggestions.length === 0 ) return Promise.resolve([])
    return Promise.all(suggestions.map(async (s: ProductsSuggestions )=> {
        return serializer(s)
    })) 
}


