import supertest from "supertest";
import { Request, Response } from "../../domain/protocols/http";
import { FileRepository } from "../../domain/vendors/FileRepository";
import { success } from "../helpers/http-helper";
import { AccessType, MainController } from "../helpers/MainController";

export class StreamControler extends MainController{

    constructor(
        private readonly fileRepository: FileRepository){
            super(AccessType.MART)
    }
    async handler(request: Request): Promise<Response> {
        return success("aqui esta")
        //aqui eu devo strimar qualquer tipo de arquivo
        
   

    }

}