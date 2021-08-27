import { CreateSuggestion } from "../../../../data/mart/suggestions/CreateSuggestion";
import { BodyValidator } from "../../../../domain/protocols/ControllerBateries";
import { Request, Response } from "../../../../domain/protocols/http";
import { badRequest, success } from "../../../helpers/http-helper";
import { AccessType, MainController } from "../../../helpers/MainController";
import { InvalidRequestBodyError } from '../../../../domain/protocols/Errors/CommonErrors'

export class MakeSuggestionController extends MainController {
    constructor( 
        suggestionSchema: any,
        private readonly itemValidator: BodyValidator,
        private readonly createSuggestion: CreateSuggestion,
    ){
        super(AccessType.MART, suggestionSchema)
    }
    async handler(request: Request): Promise<Response> {
        
        const { user, body } = request
        const { items } = body

        const itemList = JSON.parse(items)

        if(itemList.length == 0 || !Array.isArray(itemList) ) {
            return badRequest( InvalidRequestBodyError(  {'items': " Informe ao menos uma sugestão"} ) )
        } 

        var itemsErrors: any = {  }
        await Promise.all(itemList.map( async (j:any,i:number) =>{
            var errors = await this.itemValidator.validate(j)
            if(errors) { itemsErrors[i] = errors  }
        }))

        if(itemsErrors.length > 0){   
            return badRequest( InvalidRequestBodyError(  {'items': itemsErrors} ) )
        }

        const stored = await this.createSuggestion.execute({mart_id: user.id, items})
        return success(stored)

    }

}