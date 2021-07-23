import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";

export class CreateMartController  extends MainController{

    constructor(){  super(AccessType.ADMIN,{
            name: { type: "string"},
            email: { type: "email"}
        })
    }
    async handler(request: Request): Promise<Response> {

        return success('Gabriel cagãosdfds')

    }
}