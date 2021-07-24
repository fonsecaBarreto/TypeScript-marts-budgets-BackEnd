import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { AccessDeniedError } from './Errors'
import { Response } from './http'

export interface UserAuthentication {
    execute( req: ExpressRequest):  Promise<Response | null>
}

export interface ContentTypeHandler {
    execute(req: ExpressRequest, res:ExpressResponse ):  Promise<Response | null>
}

export interface SchemaRow {
    type: string,
    size?: number,
    optional?: boolean,
    label?:string,
    missingMessage?:string,
    invalidMessage?:string
}
export interface ErrorsParams extends Record<string, string> {}

export interface BodyValidator {
    validate(body: Record<string, any>): Promise<ErrorsParams | null> ,
}





