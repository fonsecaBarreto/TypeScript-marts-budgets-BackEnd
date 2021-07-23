import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express'
/* protocols */
import { Request, Response, AppController, AppMiddleware } from './http'
import { BodyValidator } from './BodyValidator';
import { InvalidRequestBodyError, ServerError } from './Errors';

export abstract class ExpressController implements AppController{

    protected readonly middlewares: AppMiddleware[]
    constructor( 
        protected readonly bodyValidator?: BodyValidator,
        ...middlewares:AppMiddleware[] 
        ){
            this.middlewares = middlewares
        }
        
    abstract handler(request: Request): Promise<Response>

    runMiddlewares(request:Request): Promise<Response | null>{
        
        return new Promise( async (resolve, reject) => {

            try{
                if(this.middlewares && this.middlewares.length > 0 ){
                    await Promise.all(this.middlewares.map( async m =>{
                        const respo = await m.handler(request)
                        if(respo) return resolve(respo)
                    }))
                }
            }catch(err){ return reject(err)}

            return resolve(null)
        })
    }

    async run(request:Request): Promise<Response>{

        try{  

            const middlewaresResponse = await this.runMiddlewares(request)
            if(middlewaresResponse) return middlewaresResponse

            if(this.bodyValidator){
                const errors = await this.bodyValidator.validate(request.body)
                if(errors) return {status: 400, body: InvalidRequestBodyError(errors)}
            }

            return await this.handler(request)
        }catch(err){ 
            console.log("Error: ", err)
            if( err?.code == "ApplicationError" ){ return {status: 403, body: err} }
            return { status: 500, body: ServerError()}
        }
    }

    execute(){
        return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {

            var request: Request = {  
                headers: req.headers,
                body: req.body || {}, 
                params: req.params,  
                query: req.query,
            }

            const response = await this.run(request)
            sendResponse(res, response)
        }
    }
}


export function sendResponse(res: ExpressResponse, response: Response){

    if(response.status >= 400 ){
        console.log("Error: ", response.body)
        return res.status(response.status).json({ error: {
            name: response.body.name,
            message: response.body.message,
            params: response.body.params,
         } })
    }else{   
        return res.status(response.status).json(response.body)
    }
}