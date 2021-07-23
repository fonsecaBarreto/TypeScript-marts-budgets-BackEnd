import { ExpressController } from "../../domain/protocols/ExpressController";
import { AppMiddleware, Request, Response } from "../../domain/protocols/http";
import { unauthorized } from "./http-helper";
import { SchemaRow } from '../../domain/protocols/BodyValidator';
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { Encrypter } from "../../domain/vendors/Encrypter";
import JsonValidator from '../../libs/JsonValidator'

export enum AccessType {  ADMIN, PUBLIC, MART }

export abstract class MainController extends ExpressController {
    static encrypter: Encrypter
    static adminsRepository: DatabaseAdapter
    static martsRepository: DatabaseAdapter
    constructor(access:AccessType = AccessType.ADMIN, schema?:Record<string, SchemaRow>, ...middlewares: AppMiddleware[]){
        const validator = schema ? new JsonValidator(schema) : null

        const isAdmin = new AdminAuthenticteMiddleware( MainController.encrypter, MainController.adminsRepository )
        const isMart = new MartAuthenticateMiddleware( MainController.encrypter, MainController.martsRepository )

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


const extractToken = (request: Request):string | null =>{
    const { headers, query } = request 
    var token: string | null = headers.authorization ? headers.authorization.split(' ')[1] : null
    if(!token) {
        token = query.a ? query.a + "" : null
        if(!token) return null
    }
    return token

}

export class AdminAuthenticteMiddleware implements AppMiddleware {
    constructor(
        private readonly encrypter: Encrypter,
        private readonly adminRepository: DatabaseAdapter
    ){}
    async handler(request: Request): Promise<Response | null> {

        const token = extractToken(request)
        if(!token) return unauthorized()
        
        const decoded = await this.encrypter.decode(token)
        if(!decoded || !decoded.id) return unauthorized() 

        const adminExists = await this.adminRepository.find({id: decoded?.id})
        if(!adminExists) return unauthorized()

        request.admin = adminExists
        return null
    }
}


export class MartAuthenticateMiddleware implements AppMiddleware {
    constructor(
        private readonly encrypter: Encrypter,
        private readonly martRepository: DatabaseAdapter
    ){}
    async handler(request: Request): Promise<Response | null> {

        const token = extractToken(request)
        if(!token) return unauthorized()
    
        const decoded = await this.encrypter.decode(token)
        if(!decoded || !decoded.id) return unauthorized() 

        const martExists = await this.martRepository.find({id: decoded?.id})
        if(!martExists) return unauthorized()

        request.mart = martExists
        return null
    
  }
}

