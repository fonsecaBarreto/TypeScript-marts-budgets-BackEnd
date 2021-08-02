import { Request as ExpressRequest } from 'express'
import { UserAuthentication } from "../../domain/protocols/ControllerBateries"
import { DatabaseAdapter } from '../../domain/vendors/DatabaseAdapter'
import { Encrypter } from '../../domain/vendors/Encrypter'
import { forbidden, unauthorized } from './http-helper'
import { Response } from '../../domain/protocols/http'
import { SessionExpiredError } from '../../domain/protocols/Errors'


export enum AccessType { PUBLIC, ADMIN, MART, MART_OR_ADMIN }
export class AuthenticationHandler implements UserAuthentication {
    constructor(
        private readonly encrypter: Encrypter,
        private readonly adminRepository: DatabaseAdapter,
        private readonly martRepository: DatabaseAdapter,
        private readonly access: AccessType
    ){}

    private extractToken = (request: ExpressRequest):string | null =>{
        const { headers, query } = request 
        var token: string | null = headers.authorization ? headers.authorization.split(' ')[1] : null
        if(!token) {
            token = query.a ? query.a + "" : null
            if(!token) return null
        }
        return token
    }
    
    async execute( request: ExpressRequest): Promise<Response | null> {
        
        var decoded:any;
        var user: any;

        const token = this.extractToken(request)
        if(!token) return unauthorized()
        
        try{
            decoded  = await this.encrypter.decode(token)
        }catch(err){
            console.log(err)
            
            switch(err.name){
                case "TokenExpiredError": return forbidden(SessionExpiredError()); break;
                default: return unauthorized()
            }
        }

        if(!decoded || !decoded.id) return unauthorized() 

        if(decoded.exp){
            console.log('*Token Gerado em', new Date( decoded.iat * 1000 ))
            console.log("*Token expira em", new Date( decoded.exp * 1000 ))
        } else { console.log("*sem tempo de expiração")}
        console.log('\n')
        
        switch(this.access){
            case AccessType.MART : {
                user = await this.martRepository.find({ id: decoded?.id })
            };break;

            case AccessType.ADMIN : {
                user = await this.adminRepository.find({ id: decoded?.id })
            };break;

            case AccessType.MART_OR_ADMIN : {
                user = await this.adminRepository.find({id: decoded?.id})
                if(!user){
                    user = await this.martRepository.find({ id: decoded?.id })
                }
            };break;
        }

        if(!user) return unauthorized()

        request.user = user
        return null
    }
}
