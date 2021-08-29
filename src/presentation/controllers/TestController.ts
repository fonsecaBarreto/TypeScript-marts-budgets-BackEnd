import { success } from "../helpers/http-helper";
import { Request, Response } from "../../domain/protocols/http";
import { AccessType, MainController } from "../helpers/MainController";
import { FileSchema } from "../helpers/FormDataParser";

const annexSchema: Record<string, FileSchema> = {
    annexs: {
        optional: false,
        types: ['image/jpeg','image/png','application/pdf'],
        max_size: 0.5e+6,
        multiples: 3
    },
}


export class TestController extends MainController{
    constructor( ){
        super(AccessType.PUBLIC, null, annexSchema)
    }

    async handler(request: Request): Promise<Response> {
        return success(request.files)
    }
}