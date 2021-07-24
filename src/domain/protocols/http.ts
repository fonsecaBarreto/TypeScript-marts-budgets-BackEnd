import { AdminModel } from "../../domain/entities/AdminModel"
import { MartModel } from "../../domain/entities/MartModel"


export type Request = {
    params: any,
    query: any,
    headers: any
    body?:any,
    user?: MartModel | AdminModel,
    file?: any
}

export type Response = {
    status: number,
    body?:any
}

export interface AppController { handler(request: Request): Promise<Response> }

export interface AppMiddleware { handler(request: Request): Promise<Response | null> }
