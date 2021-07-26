import { ContentTypeHandler } from "../../domain/protocols/ControllerBateries";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import Formidable from 'formidable'
import { rejects } from "assert/strict";
import { forbidden } from "./http-helper";
import { MartNotFoundError, unexpectedFileError } from "../../domain/protocols/Errors";
import { fileRepository } from "../../main/factories";


/* 
const COMMON_IMAGES =  ["image/png", "image/jpeg", "image/jpg", "image/webp" ]

const COMMON_DOCUMENTS  = [ 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf"
] */

export interface FileSchema {
    types: string[],
    max_size: number,
    optional: boolean
}

export class FormDataParser implements ContentTypeHandler {
    constructor( private readonly fileSchema: Record<string, FileSchema> ){}
    
    execute(request: ExpressRequest, response: ExpressResponse ): Promise<Response | null> {
        
        const filesBuffer:any = {}
        
        if(!this.fileSchema) return null
        const fieldNames = Object.keys(this.fileSchema)
        const multiples = fieldNames.length > 0  ? true : false
        const formidable = Formidable({ multiples });

        return new Promise((resolve, reject) => {

            formidable.parse(request, async (err: Error, fields:any, files: any) => {
                
                if(err) {return reject(err)} 
                  console.log("field", fields)
                  request.body = { ...fields }

                  /// se ao final algum paramentro nao opcional estiver faltand, deve se jogar um error tmsparam
                  return resolve(null)
              }); 

            formidable.onPart = (part) => {

                if (!part.filename || !part.mime ) { formidable.handlePart(part);  } // all non-files will pass

                if(fieldNames.includes(part.name)) { 
                    console.log(part.name)
                    console.log(part)
                    //aqui eu deve extrair os vuffer e fitlrar sa porra
                } 
           
              
                part.on('data', (buffer) => {
                    console.log(buffer)
             /*        console.log("data") */
                // do whatever you want here
                });
            };

/* 

            formidable.on('fileBegin', (formname, file) => {
                formidable.emit('data', { name: 'fileBegin', formname, value: file });
            });
       

            formidable.on('file', (formname, file) => {
                formidable.emit('data', { name: 'file', formname, buffer: file });
              });
              


            formidable.on('data', ({ name, key, value, buffer, start, end, formname, ...more }) =>{

                console.log('data', buffer)
  

            })


            formidable.once('error', console.error);

           */
        })
    }
}


