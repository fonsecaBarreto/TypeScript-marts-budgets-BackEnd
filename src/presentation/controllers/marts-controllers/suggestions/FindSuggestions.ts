import { Request, Response } from "../../../../domain/protocols/http";
import { success } from "../../../helpers/http-helper";
import { AccessType, MainController } from "../../../helpers/MainController";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";
import { MapSuggestions } from './serializers/suggestionPrivateView'

export class FindSuggestionController extends MainController {
    constructor( 
        private readonly repository: DatabaseAdapter,
        private readonly serializer: any
    ){
        super(AccessType.ADMIN)
    }
    async handler(request: Request): Promise<Response> {
        
        const suggestions = await this.repository.list({})


        suggestions.sort((a:any,b:any) => (a.created_at > b.created_at) ? -1 : ((b.created_at > a.created_at) ? 1 : 0))
        return success( await MapSuggestions(suggestions, this.serializer))

    }

}