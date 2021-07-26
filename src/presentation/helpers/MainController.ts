import { ExpressController } from "../../domain/protocols/ExpressController";
import { Request, Response } from "../../domain/protocols/http";
import { SchemaRow } from '../../domain/protocols/ControllerBateries';
import JsonValidator from '../../libs/JsonValidator'
import { AuthenticationHandler, AccessType} from './Authentication'
import { FormDataParser, FileSchema } from './FormDataParser'

/* vendors */
import { Encrypter } from "../../domain/vendors/Encrypter";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";

export * from './Authentication'

export abstract class MainController extends ExpressController {

    static encrypter: Encrypter
    static adminRepository: DatabaseAdapter
    static martRepository: DatabaseAdapter

    constructor( accessType: AccessType = AccessType.ADMIN, schema?:Record<string, SchemaRow>, fileSchema?: Record<string, FileSchema>  ){
            
        const bodyValidator = schema ? new JsonValidator(schema) : null

        const userAuthentication = accessType == AccessType.PUBLIC ?  null :
            new AuthenticationHandler( 
                MainController.encrypter, 
                MainController.adminRepository, 
                MainController.martRepository, accessType) 
                
        const contentTypeHandler = fileSchema != null ? new FormDataParser(fileSchema) : null
   
        super({ userAuthentication, bodyValidator, contentTypeHandler })
    }
    abstract handler(request: Request): Promise<Response>
}
