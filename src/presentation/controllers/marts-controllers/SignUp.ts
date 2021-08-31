import { Request, Response } from "../../../domain/protocols/http";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, {CreateMart} from "../../../data/mart/CreateMart";
import { BodyValidator, SchemaRow } from "../../../domain/protocols/ControllerBateries";
import { badRequest, success } from "../../helpers/http-helper";
import { FileSchema } from "../../helpers/FormDataParser";
import { rows, SignUp as SignupList } from '../../schemas/mart-schemas.json'
import { InvalidRequestBodyError } from "../../../domain/protocols/Errors/CommonErrors";
import CreateAddress from "../../../data/address/CreateAdress";
import CreateAnnex from "../../../data/mart/annex/CreateAnnex";
import { SignUpEmailHook } from './emailhooks/index'
import address from "../../../main/routes/address";

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
        private readonly createAnnex: CreateAnnex,
        private readonly hookMailer: SignUpEmailHook,
   
        ){ super(AccessType.PUBLIC, SignUpSchema, annexSchema ) }

    async validateAddress(json: any) {

        var address = JSON.parse(json)
        const errors = await this.adressValidator.validate(address)
        if(errors){
            var outputErr:any= { address:{} }
            Object.keys(errors).map((e:string) =>{ outputErr.address[e]=errors[e] })
            throw InvalidRequestBodyError(outputErr)

        }
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
        }catch(err){ return badRequest(err) }

        const storedAddress = await this.createAddress.execute(address)

        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed,  responsible_name, 
            obs: "", password : null, image: null,
            financial_email: null, corporate_name: null,
            address_id: storedAddress.id,
        }

        const stored = await this.createNewMart.execute(params)

        await this.addAnnexs(annexs, stored.id)
   
        this.hookMailer.execute(stored)

        return success(stored)
    }
}


