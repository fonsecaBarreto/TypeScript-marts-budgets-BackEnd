import { ExpressController } from "../../domain/protocols/ExpressController";
import { AppMiddleware, Request, Response } from "../../domain/protocols/http";

import { SchemaRow } from '../../domain/protocols/BodyValidator';
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { Encrypter } from "../../domain/vendors/Encrypter";
import JsonValidator from '../../libs/JsonValidator'
import { AuthenticteMiddleware } from './AuthenticatonMiddleware'
export enum AccessType {  ADMIN, PUBLIC, MART }

export abstract class MainController extends ExpressController {

    static encrypter: Encrypter
    static adminsRepository: DatabaseAdapter
    static martsRepository: DatabaseAdapter

    constructor(access:AccessType = AccessType.ADMIN, schema?:Record<string, SchemaRow>, ...middlewares: AppMiddleware[]){
        const validator = schema ? new JsonValidator(schema) : null

        const isAdmin = new AuthenticteMiddleware( MainController.encrypter, MainController.adminsRepository )
        const isMart = new AuthenticteMiddleware( MainController.encrypter, MainController.martsRepository )

        if(access !== AccessType.PUBLIC){
            switch(access){
                case AccessType.MART:  middlewares.unshift(isMart);break;
                default: middlewares.unshift(isAdmin)
            }
        }
        super(validator, ...middlewares)
    }
    abstract handler(request: Request): Promise<Response>
}



