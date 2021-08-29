import { Request, Response } from "../../../../domain/protocols/http";
import { success } from "../../../helpers/http-helper";
import { AccessType, MainController } from "../../../helpers/MainController";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";
import { MapRating } from './serializers/RatingPrivateView'

export class FindRatingController extends MainController {
    constructor( 
        private readonly repository: DatabaseAdapter,
        private readonly serializer: any
    ){
        super(AccessType.ADMIN)
    }
    async handler(request: Request): Promise<Response> {
        
        const ratings = await this.repository.list({})

        ratings.sort((a:any,b:any) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0))
     
        return success( await MapRating(ratings, this.serializer))

    }

}