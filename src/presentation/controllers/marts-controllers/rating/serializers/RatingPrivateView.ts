import { MartsRating } from "../../../../../domain/entities/MartModel"
import { DatabaseAdapter } from "../../../../../domain/vendors/DatabaseAdapter"

export type MartLabelView = {
    label: string,
    value: string
}

export interface RatingPrivateView extends MartsRating {
    mart: MartLabelView
}

export const MakeRatingPrivateView = ( martsRepo: DatabaseAdapter ) =>{

    return async (rating: MartsRating): Promise<RatingPrivateView> => {
        if(!rating) return 

        const { mart_id } = rating

        var mart = null
        const martExists = await martsRepo.find({ id: mart_id })
        if(martExists){
            mart = { label: martExists.name, value: martExists.id }
        }

        const novo=  ({ ...rating, mart}) 
        return novo
}}

export const MapRating = (ratings: any[], serializer: any):  Promise<any> =>{
    if(ratings.length === 0 ) return Promise.resolve([])
    return Promise.all(ratings.map(async (s: MartLabelView )=> {
        return serializer(s)
    })) 
}


