
import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, {CreateMart} from "../../../data/mart/CreateMart";
import { rows, SignUp as SignupList } from './Schemas.json'
import { SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { success, unauthorized } from "../../helpers/http-helper";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { FileSchema } from "../../helpers/FormDataParser";
import { CreateMartController } from "./Crud";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import { MartModel } from "../../../domain/entities/MartModel";
import { AccessDeniedError } from "../../../domain/protocols/Errors";

const schemasRows: Record<string, SchemaRow> = rows
const SignUpSchema:any = {}
SignupList.forEach( ( key:string ) => SignUpSchema[key] = schemasRows[key] )


export class SignUpMartController extends MainController {
    constructor( 
        private readonly createNewMart: CreateNewMart 
        ){ super(AccessType.PUBLIC, SignUpSchema) }
    async handler(request: Request): Promise<Response> {
        const { name, email, phone, cnpj_cpf, transfer_allowed } = request.body

          // shouw receive file also
        const annex: string = null
        const image: string = null 
        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed, 
            password : null, annex, image,
        }
        const stored = await this.createNewMart.execute(params)
        return success(stored)
    }
}


/*  */
const annexSchema: Record<string, FileSchema> = {
    annex: {
        optional: true,
        types: ['image/jpeg'],
        max_size: 10e+6,
    },
    outro: {
        optional: true,
        types: ['image/jpeg'],
        max_size: 10e+6,
    },
}

export class UploadMartAnnexController extends MainController {
    constructor( 
        private readonly martRepository: DatabaseAdapter,
        private readonly fileRepository: FileRepository
        ){ super(AccessType.MART, null, annexSchema ) }
    async handler(request: Request): Promise<Response> {
        

        return success({
            body: request.body, files: request.files
        })
 
        const { user, files } = request
        
        const mart:any = { ...user}
        if(mart.annex) { return unauthorized()}

        const name = "documents/strict_document_"  + Date.now()

        const result = await this.fileRepository.save({
            buffer: file.buffer,
            contentType: file.mimetype,
            name
        })

        await this.martRepository.update({ id:user.id}, { annex: result.name })
         
        return success()
    }
}