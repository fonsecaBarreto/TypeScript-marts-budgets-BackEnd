
import { Request, Response } from "../../../../domain/protocols/http";
import {  success } from "../../../helpers/http-helper";
import { AccessType, MainController } from "../../../helpers/MainController";

import { CreateRating } from "../../../../data/mart/rating/CreateRating";

export class MakeRatingontroller extends MainController {
    constructor( 
        ratingSchema: any,
        private readonly createRating: CreateRating,
    ){ super(AccessType.MART, ratingSchema) }

    async handler(request: Request): Promise<Response> {
        
        const { user, body } = request


        const stored = await this.createRating.execute({mart_id: user.id, ...body})

        return success(stored)

    }

}