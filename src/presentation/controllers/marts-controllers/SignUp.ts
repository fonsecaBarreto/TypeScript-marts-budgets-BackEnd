import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, {CreateMart} from "../../../data/mart/CreateMart";
import { BodyValidator, SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { badRequest, success } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { rows, SignUp as SignupList } from '../../schemas/mart-schemas.json'
import { InvalidRequestBodyError } from "../../../domain/protocols/Errors/CommonErrors";
import CreateAddress from "../../../data/address/CreateAdress";
import CreateAnnex from "../../../data/annex/CreateAnnex";

import mime from 'mime-types'

const schemasRows: Record<string, SchemaRow> = rows
const SignUpSchema:any = {}
SignupList.forEach( ( key:string ) => SignUpSchema[key] = schemasRows[key] )

const annexSchema: Record<string, FileSchema> = {
    annexs: {
        optional: true,
        types: ['image/jpeg','image/png','application/pdf'],
        max_size: 5e+6,
        multiples: 10
    }
}

export class SignUpMartController extends MainController {

    constructor( 
        private readonly adressValidator: BodyValidator,
        private readonly createAddress: CreateAddress,
        private readonly createNewMart: CreateNewMart,
        private readonly createAnnex: CreateAnnex

        ){ super(AccessType.PUBLIC, SignUpSchema, annexSchema ) }
    async handler(request: Request): Promise<Response> {

        const { body, files } = request
        const { annexs } = files
        const { name, email, phone, cnpj_cpf, transfer_allowed, address, responsible_name } = body

        //Validates the address
        const errors = await this.adressValidator.validate(JSON.parse(address))
        if(errors){
            var outputErr:any= { address:{} }
            Object.keys(errors).map((e:string) =>{ outputErr.address[e]=errors[e] })
            return  badRequest(InvalidRequestBodyError(outputErr))
        }

        /* Check duplicity */
        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone)

        //store adress
        const storedAddress = await this.createAddress.execute(JSON.parse(address))

        //create new mart
        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed,  responsible_name, 
            obs: "",
            password : null, 
            image: null,
            address_id: storedAddress.id,
            financial_email: null, 
            corporate_name: null
        }

        const stored = await this.createNewMart.execute(params)

        if(annexs){
            await Promise.all(annexs.map( async (annex: any) =>{
                await this.createAnnex.execute({
                    buffer: annex.buffer,
                    contentType: annex.contentType,
                    mart_id:stored.id,
                    name: (annex.fileName).split('.').slice(0, -1).join('.')
                })
            }))  
        }


        return success(stored)
    }
}


