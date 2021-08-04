
import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, {CreateMart} from "../../../data/mart/CreateMart";
import { rows, SignUp as SignupList } from '../../schemas/mart-schemas.json'
import { SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { success, unauthorized } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { FileRepository } from "../../../domain/vendors/FileRepository";

const schemasRows: Record<string, SchemaRow> = rows
const SignUpSchema:any = {}
SignupList.forEach( ( key:string ) => SignUpSchema[key] = schemasRows[key] )

const annexSchema: Record<string, FileSchema> = {
    annex: {
        optional: true,
        types: ['image/jpeg','image/png','application/pdf'],
        max_size: 5e+6,
    }
}

export class SignUpMartController extends MainController {
    constructor( 
        private readonly createNewMart: CreateNewMart,
        private readonly fileRepository: FileRepository
        ){ super(AccessType.PUBLIC, SignUpSchema, annexSchema ) }
    async handler(request: Request): Promise<Response> {

        const { body, files } = request

        const { name, email, phone, cnpj_cpf, transfer_allowed } = body
        const { annex } = files

        // save the file
        var annex_name = null
        if(annex){
            const fileStored = await this.fileRepository.save({
                buffer: annex.buffer,
                contentType: annex.contentType,
                name: "documents/strict_document_"  + Date.now()
            })
            annex_name = fileStored.name
        }

        //create new mart
        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed, 
            password : null, 
            image: null,
            annex: annex_name
        }
        
        const stored = await this.createNewMart.execute(params)

        return success(stored)
    }
}


/*  */


export class UploadMartAnnexController extends MainController {
    constructor( 
        private readonly martRepository: DatabaseAdapter,
        private readonly fileRepository: FileRepository
        ){ super(AccessType.MART, null, annexSchema ) }
    async handler(request: Request): Promise<Response> {
    
        return success("ok")
    }
}