import { CreateSuggestion } from "../../../../data/mart/suggestions/CreateSuggestion";
import { BodyValidator } from "../../../../domain/protocols/ControllerBateries";
import { Request, Response } from "../../../../domain/protocols/http";
import { badRequest, success } from "../../../helpers/http-helper";
import { AccessType, MainController } from "../../../helpers/MainController";
import { InvalidRequestBodyError } from '../../../../domain/protocols/Errors/CommonErrors'
import { UpdateCheckList } from "../../../../data/mart/checklist";

export class MakeSuggestionController extends MainController {
    constructor( 
        suggestionSchema: any,
        private readonly itemValidator: BodyValidator,
        private readonly createSuggestion: CreateSuggestion,
        private readonly updateCheckList: UpdateCheckList
    ){
        super(AccessType.MART, suggestionSchema)
    }
    async handler(request: Request): Promise<Response> {
        
        const { user, body, query } = request
        const items= body?.items

        if( !items ){ 
            await this.updateCheckList.setFirst_suggestions({ mart_id:user.id })
            return success()
        }

        const itemList = JSON.parse(items)

        if(itemList.length == 0 || !Array.isArray(itemList) ) {
            return badRequest( InvalidRequestBodyError(  {'items': " Informe ao menos uma sugestão"} ) )
        } 

        var itemsErrors: any = {  }
        await Promise.all(itemList.map( async (j:any,i:number) =>{
            var errors = await this.itemValidator.validate(j)
            if(errors) { itemsErrors[i] = errors }
            itemList[i]=j
            
        }))

        if(Object.keys(itemsErrors).length > 0){   
            return badRequest( InvalidRequestBodyError(  {'items': itemsErrors} ) )
        }

        const stored = await this.createSuggestion.execute({mart_id: user.id, items: itemList})

        await this.updateCheckList.setFirst_suggestions({ mart_id:user.id })

        return success(stored)

    }

}