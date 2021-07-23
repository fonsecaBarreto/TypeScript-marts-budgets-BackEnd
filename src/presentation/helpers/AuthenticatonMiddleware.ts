import { AppMiddleware, Request, Response} from "../../domain/protocols/http";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { Encrypter } from "../../domain/vendors/Encrypter";
import { unauthorized } from "./http-helper";


export class AuthenticteMiddleware implements AppMiddleware {
    constructor(
        private readonly encrypter: Encrypter,
        private readonly repository: DatabaseAdapter
    ){}

    private extractToken = (request: Request):string | null =>{
        const { headers, query } = request 
        var token: string | null = headers.authorization ? headers.authorization.split(' ')[1] : null
        if(!token) {
            token = query.a ? query.a + "" : null
            if(!token) return null
        }
        return token
    }
    
    async handler(request: Request): Promise<Response | null> {

        const token = this.extractToken(request)
        if(!token) return unauthorized()
        
        const decoded = await this.encrypter.decode(token)
        if(!decoded || !decoded.id) return unauthorized() 

        const exists = await this.repository.find({id: decoded?.id})
        if(!exists) return unauthorized()

        request.user = exists
        return null
    }
}