
import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, {CreateMart} from "../../../data/mart/CreateMart";
import { rows, SignUp as SignupList } from './Schemas.json'
import { SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { success, unauthorized } from "../../helpers/http-helper";
import { IdGenerator } from "../../../domain/vendors/Utils";
import { ContentType } from "../../helpers/MulterAdapter/MultiPartContent";
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


export class UploadMartAnnexController extends MainController {
    constructor( 
        private readonly martRepository: DatabaseAdapter,
        private readonly fileRepository: FileRepository
        ){ super(AccessType.MART, null, ContentType.DOCUMENT ) }
    async handler(request: Request): Promise<Response> {
        const { user, file } = request
        
        const mart:any = { ...user}
        if(mart.annex) { return unauthorized()}

        const name = "documents/strict_document_"  + Date.now()

        await this.fileRepository.save({
            buffer: file.buffer,
            contentType: file.mimetype,
            name
        })

        await this.martRepository.update({ id:user.id}, { annex: name })
         
        return success()
    }
}