import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, {CreateMart} from "../../../data/mart/CreateMart";
import { BodyValidator, SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { badRequest, success } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import { rows, SignUp as SignupList } from '../../schemas/mart-schemas.json'
import { InvalidRequestBodyError } from "../../../domain/protocols/Errors/CommonErrors";
import CreateAddress from "../../../data/address/CreateAdress";
import { SocketAddress } from "net";

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
        private readonly adressValidator: BodyValidator,
        private readonly createAddress: CreateAddress,
        private readonly createNewMart: CreateNewMart,
        private readonly fileRepository: FileRepository,
        ){ super(AccessType.PUBLIC, SignUpSchema, annexSchema ) }
    async handler(request: Request): Promise<Response> {

        const { body, files } = request
        const { annex } = files
        const { name, email, phone, cnpj_cpf, transfer_allowed, address,
        responsible_name } = body

        const errors = await this.adressValidator.validate(JSON.parse(address))
        if(errors){
            var outputErr:any= { address:{} }
            Object.keys(errors).map((e:string) =>{ outputErr.address[e]=errors[e] })
            return  badRequest(InvalidRequestBodyError(outputErr))
        }

        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone)

        //maybe here should have some, validate cep or something
        //store annex
        var annex_name = null
        if(annex){
            const fileStored = await this.fileRepository.save({
                buffer: annex.buffer,
                contentType: annex.contentType,
                name: "documents/strict_document_"  + Date.now()
            })
            annex_name = fileStored.name
        }

        //store adress
        const storedAddress = await this.createAddress.execute(JSON.parse(address))

        //create new mart
        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed, 
            password : null, image: null,
            annex: annex_name,

            address_id: storedAddress.id,
            responsible_name, 
            obs: "",
            financial_email: null, 
            corporate_name: null
        }

        const stored = await this.createNewMart.execute(params)

        return success(stored)
    }
}


