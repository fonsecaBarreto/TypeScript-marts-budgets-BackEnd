import { Request, Response } from "../../../domain/protocols/http";
import { badRequest, success } from "../../helpers/http-helper";
import { AccessType, MainController } from "../../helpers/MainController";
import CreateNewMart, { CreateMart } from "../../../data/mart/CreateMart";
import { BodyValidator, SchemaRow } from "../../../domain/protocols/ControllerBateries";

import { rows,  Create as CreateList, Update as UpdateList } from '../../schemas/mart-schemas.json'
import { MartAnnex, MartModel } from "../../../domain/entities/MartModel";

import { DisagreementPasswordError, InvalidRequestBodyError, MartNotFoundError } from "../../../domain/protocols/Errors";
import  CreateAddress from "../../../data/address/CreateAdress";
import { MapMarts } from "./serializers/MartPrivateView";
import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import FindMart from "../../../data/mart/FindMart";

const schemasRows: Record<string, SchemaRow> = rows

const CreateSchema:any = {}
CreateList.forEach( ( key:string ) => CreateSchema[key] = schemasRows[key] )
const UpdateSchema:any = {}
UpdateList.forEach( ( key:string ) => UpdateSchema[key] = schemasRows[key] )

export class CreateMartController  extends MainController{
  
    constructor( 
        private readonly adressValidator: BodyValidator, 
        private readonly createAddress: CreateAddress,
        private readonly createNewMart: CreateNewMart,
        private readonly serializer: any,
    ){ super(AccessType.ADMIN, CreateSchema) }
    async handler(request: Request): Promise<Response> {

        const { password, passwordConfirmation, name, cnpj_cpf, email, phone, transfer_allowed, 
            responsible_name,corporate_name, financial_email, obs, address } = request.body

        if(password !== passwordConfirmation) throw DisagreementPasswordError()

        const errors = await this.adressValidator.validate(JSON.parse(address))
        if(errors){
            var outputErr:any= { address:{} }
            Object.keys(errors).map((e:string) =>{ outputErr.address[e]=errors[e] })
            return  badRequest(InvalidRequestBodyError(outputErr))
        }

        await this.createNewMart.checkDuplicity(cnpj_cpf, email, phone, corporate_name, financial_email)


        const storedAddress = await this.createAddress.execute(JSON.parse(address))

        //create new mart
        const params: CreateMart.Params = {
            name, email, phone, cnpj_cpf, transfer_allowed,  password,
            image: null,
            address_id: storedAddress.id,
            responsible_name, 
            obs,
            financial_email, 
            corporate_name
        }

        const stored = await this.createNewMart.execute(params)
        return success(await this.serializer(stored))
    }
}

export class UpdateMartController  extends MainController{
    constructor(  private readonly createNewMart: CreateNewMart ,
        private readonly serializer: any,
    ){ super(AccessType.ADMIN, UpdateSchema) }
    async handler(request: Request): Promise<Response> {

        const { name, cnpj_cpf, email, phone, transfer_allowed,
            responsible_name,corporate_name, financial_email, obs } = request.body

        const stored = await this.createNewMart.update({ id: request.params.id, name, cnpj_cpf, email, phone, transfer_allowed,
            responsible_name,corporate_name, financial_email, obs })
        return success(stored)
    }
}

/* Find, Remove, List */

export class FindController  extends MainController{
    constructor( 
        private readonly findApp: FindMart,
        private readonly serializer: any,
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {

        const result = await this.findApp.execute(request.params.id)
        
        if(request.params.id){
            return success(await this.serializer(result))
        }else{

            return success(await MapMarts( result, this.serializer))
        }
    }
}

export class RemoveController  extends MainController{
    constructor( 
        private readonly martsRepository: DatabaseAdapter,
        private readonly addressRepository: DatabaseAdapter,
        private readonly annexsRepository: DatabaseAdapter,
        private readonly fileRepository: FileRepository
    ){  super(AccessType.ADMIN) }
    async handler(request: Request): Promise<Response> {

        const id = request.params.id
        const exists = await this.martsRepository.find({id})
        if(!exists) throw MartNotFoundError()


        if(exists.image){
            await this.fileRepository.remove(exists.image)
        }
        
        if(exists.address_id){
            await this.addressRepository.remove({id: exists.address_id})
        }

        var annexes = await this.annexsRepository.list({mart_id: exists.id})
        console.log(annexes)

        if(annexes?.length > 0){
            await Promise.all(annexes.map( async (a: MartAnnex) =>{
                try{
                    await this.fileRepository.remove(a.name)
                }catch(err){ console.log(err)}
            }))
        }
        
        //Anexos Should be deleted here
        await this.martsRepository.remove({id})

        return success()
    }
}


