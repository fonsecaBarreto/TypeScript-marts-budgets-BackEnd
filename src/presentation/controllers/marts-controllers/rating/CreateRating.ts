
import { Request, Response } from "../../../../domain/protocols/http";
import {  success } from "../../../helpers/http-helper";
import { AccessType, MainController } from "../../../helpers/MainController";

import { CreateRating } from "../../../../data/mart/rating/CreateRating";
import { UpdateCheckList } from "../../../../data/mart/checklist/UpdateCheckList";

export class MakeRatingController extends MainController {
    constructor( 
        ratingSchema: any,
        private readonly createRating: CreateRating,
        private readonly updateCheckList: UpdateCheckList
    ){ super(AccessType.MART, ratingSchema) }

    async handler(request: Request): Promise<Response> {
        
        const { user, body } = request
        const stored = await this.createRating.execute({mart_id: user.id, ...body})

        await this.updateCheckList.setFirst_Rating({mart_id: user.id})
        return success(stored)

    }

}