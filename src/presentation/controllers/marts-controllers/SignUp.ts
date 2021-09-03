import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import { BodyValidator, SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { badRequest, serverError, success } from "../../helpers/http-helper";

import { FileSchema } from "../../helpers/FormDataParser";
/* import { rows, SignUp as SignupList } from '../../schemas/mart-schemas.json' */
import { InvalidRequestBodyError, ServerError } from "../../../domain/protocols/Errors/CommonErrors";

import { CreateMart } from "../../../data/mart/CreateMart";
import { CreateAddress } from "../../../data/address/CreateAdress";
import { CreateAnnex } from "../../../data/mart/annex/CreateAnnex";

export class SignUpMartController extends MainController {

    constructor( 
        signUpSchema: Record<string, SchemaRow>,
        fileSchema: Record<string, FileSchema>,
        private readonly adressValidator: BodyValidator,
        private readonly createAddress: CreateAddress.ICreateAddress,
        private readonly createNewMart: Pick<CreateMart.ICreateMart, 'execute' | 'checkDuplicity'>,
        private readonly createAnnex: CreateAnnex.ICreateAnnex,
        private readonly hooks:  Function
   
        ){ super(AccessType.PUBLIC, signUpSchema, fileSchema) }

    async validateAddress(json: any) {
        var address = JSON.parse(json)
        const errors = await this.adressValidator.validate(address)
        if(errors){ throw InvalidRequestBodyError({ address: errors })  }
        return address
    }

    async addAnnexs(annexs:any, mart_id: string){

        if(annexs){
            await Promise.all(annexs.map( async (annex: any) =>{
                await this.createAnnex.execute({
                    buffer: annex.buffer,
                    contentType: annex.contentType,
                    mart_id,
                    name: (annex.fileName).split('.').slice(0, -1).join('.')
                })
            }))  
        }
    }
    
    async handler(request: Request): Promise<Response> {
        const { body, files } = request
        const { annexs } = files
        var { name, email, phone, cnpj_cpf, transfer_allowed, address, responsible_name } = body

        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone)

        try{ address = await this.validateAddress(address)
        }catch(err: any){ 
            if(err?.code == "ApplicationError"){  return badRequest(err) }
            return serverError()
        }
        const storedAddress = await this.createAddress.execute(address)

        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed,  responsible_name, 
            obs: "", 
            password : null,
            image: null,
            financial_email: null, 
            corporate_name: null,
            address_id: storedAddress.id
        }

        const stored = await this.createNewMart.execute(params)
    
        await this.addAnnexs(annexs, stored.id)

        try{ this.hooks(stored) }catch(err){console.log(err)}
 
        return success(stored)
    }
}


