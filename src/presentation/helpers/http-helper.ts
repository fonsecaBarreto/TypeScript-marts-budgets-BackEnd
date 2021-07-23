import ApplicationError from "../../domain/protocols/Errors/ApplicationError"
import { AccessDeniedError, ServerError } from "../../domain/protocols/Errors/CommonErrors"


export const serverError = () =>{
    return { status: 500, body: ServerError() }
}

export const success = (body?: any) =>{
    return { status: body ? 200 : 204, body }
}

export const unauthorized = () =>{
    return { status: 401, body: AccessDeniedError()  }
}

export const forbidden = (error: ApplicationError) => {
    return { status: 403, body: error }
} 

export const badRequest = (error: ApplicationError) => {
    return { status: 400, body: error }
} 

  