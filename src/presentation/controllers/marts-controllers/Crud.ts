import { Request, Response } from "../../../domain/protocols/http";
import { success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart from "../../../data/mart/CreateMart";
import { MartApp } from "../../../data/mart/MartApp";
import { SchemaRow } from "../../../domain/protocols/ControllerBateries";

import { rows,  Create as CreateList, Update as UpdateList } from '../../schemas/mart-schemas.json'
import { MartModel } from "../../../domain/entities/MartModel";

const schemasRows: Record<string, SchemaRow> = rows

const CreateSchema:any = {}
CreateList.forEach( ( key:string ) => CreateSchema[key] = schemasRows[key] )
const UpdateSchema:any = {}
UpdateList.forEach( ( key:string ) => UpdateSchema[key] = schemasRows[key] )

export class CreateMartController  extends MainController{
    constructor(  private readonly createNewMart: CreateNewMart 
    ){ super(AccessType.ADMIN, CreateSchema) }
    async handler(request: Request): Promise<Response> {
        const stored = await this.createNewMart.execute(request.body)
        return success(stored)
    }
}

export class UpdateMartController  extends MainController{
    constructor(  private readonly createNewMart: CreateNewMart 
    ){ super(AccessType.ADMIN, UpdateSchema) }
    async handler(request: Request): Promise<Response> {
        console.log(request)
        const stored = await this.createNewMart.update({ id: request.params.id, ...request.body})
        return success(stored)
    }
}

/* Find, Remove, List */

export class FindController  extends MainController{
    constructor( private readonly martApp: MartApp
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        const result = await this.martApp.find(request.params.id)
        if(request.params.id){
            return success(result)
        }else{
            return success(await mapMartsToAdmin(result))
        }
    }
}

export class RemoveController  extends MainController{
    constructor( private readonly martApp: MartApp
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {
        return success(await this.martApp.remove(request.params.id))
    }
}


const mapMartsToAdmin = (marts: MartModel[]):  Promise<any> =>{
    if(marts.length === 0 ) return Promise.resolve([])
    return Promise.all(marts.map(async (m: MartModel )=> {
        const novo=  ({ ...m, isActive: m.password ? true : false}) 
        delete novo.password 
        return novo 
    }))
}
