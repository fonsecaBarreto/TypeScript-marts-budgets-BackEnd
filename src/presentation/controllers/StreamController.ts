import { Request as ExpressRequest, Response as ExpressResponse} from 'express'
import { UserAuthentication } from "../../domain/protocols/ControllerBateries";
import { Request, Response } from "../../domain/protocols/http";
import { FileRepository } from "../../domain/vendors/FileRepository";
import { success } from "../helpers/http-helper";
import { AccessType, AuthenticationHandler, MainController } from "../helpers/MainController";

export function StreamControler(
    authenticator: UserAuthentication,
    fileRepository: FileRepository ) {
        return async (req: ExpressRequest, res: ExpressResponse) => {

            try{

                var response = await authenticator.execute(req) 
                if(response) {
                    return res.status(response.status).json({ error: {
                        name: response.body.name, message: response.body.message, params: response.body.params,
                    }})
                }
             
                const { query, user } = req
                const name = query.v  
                if(!name) return res.status(404).end("Not Found")
                
                const { size, contentType, stream } = await fileRepository.get(name+'')

                const head = { 'Content-Length': size, 'Content-Type': contentType }
                res.writeHead(206, head); 
                stream.pipe(res) 
                
            } catch(err) {
                console.log(err)
                return res.status(404).end("Not Found")
            }
        }
            
}

