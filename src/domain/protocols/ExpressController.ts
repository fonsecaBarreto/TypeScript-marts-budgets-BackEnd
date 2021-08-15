import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { BodyValidator, ContentTypeHandler, UserAuthentication } from './ControllerBateries';
import { InvalidRequestBodyError, ServerError } from './Errors';

import { AppController, Request, Response } from "./http";

export namespace ExpressController {
    export type Params = {
        userAuthentication?: UserAuthentication,
        contentTypeHandler?: ContentTypeHandler, 
        bodyValidator?: BodyValidator
    }
}

export abstract class ExpressController implements AppController {

    protected readonly bodyValidator: BodyValidator
    protected readonly contentTypeHandler: ContentTypeHandler
    protected readonly userAuthentication: UserAuthentication

    constructor( params: ExpressController.Params ){
        const { bodyValidator, contentTypeHandler, userAuthentication } = params
        this.contentTypeHandler = contentTypeHandler
        this.userAuthentication = userAuthentication
        this.bodyValidator = bodyValidator
    }
    abstract handler(request: Request): Promise<Response>

    execute(){
        return async (req: ExpressRequest, res: ExpressResponse) => {

            try {

                if(this.userAuthentication){
                    let provResponse = await this.userAuthentication.execute(req)
                    if(provResponse) return sendResponse(res, provResponse)
                }

                if(this.contentTypeHandler){
                    let provResponse = await this.contentTypeHandler.execute(req, res)
                    if(provResponse) return sendResponse(res, provResponse)
                }

                if(this.bodyValidator){
                    const errors = await this.bodyValidator.validate(req.body)
                    if(errors) return  sendResponse(res, { status: 400, body: InvalidRequestBodyError(errors)})
                }

                var request: Request = {  
                    headers: req.headers,
                    body: req.body || {}, 
                    params: req.params,  
                    query: req.query,
                    files: req.files,
                    user: req.user
                }

                const response = await this.handler(request)
                sendResponse(res, response)

            } catch(err) {   
                if( err?.code == "ApplicationError" ){ return sendResponse(res, { status: 403, body: err }) }
                console.log( console.log("\n *Error: ", err.stack) )
                return sendResponse(res, { status: 500, body: ServerError() }) 
            }      
        }
    }
}


export function sendResponse(res: ExpressResponse, response: Response){

    if(response.status >= 400 ){
        console.log("  --> Error: ", response.body.name)
        return res.status(response.status).json({ error: {
            name: response.body.name,
            message: response.body.message,
            params: response.body.params,
         } })
    }else{   

        if(response.stream){
            res.set(response.headers)
            res.status(response.status)
            return  response.stream.pipe(res);   
        }

        return res.status(response.status).json(response.body)
    }
}

