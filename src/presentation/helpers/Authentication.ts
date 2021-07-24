import { Request as ExpressRequest } from 'express'
import { UserAuthentication } from "../../domain/protocols/ControllerBateries"
import { DatabaseAdapter } from '../../domain/vendors/DatabaseAdapter'
import { Encrypter } from '../../domain/vendors/Encrypter'
import { unauthorized } from './http-helper'
import { Response } from '../../domain/protocols/http'


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
        
        const token = this.extractToken(request)
        if(!token) return unauthorized()
        
        const decoded = await this.encrypter.decode(token)
        if(!decoded || !decoded.id) return unauthorized() 

        var user: any;

        console.log(this.access)

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
