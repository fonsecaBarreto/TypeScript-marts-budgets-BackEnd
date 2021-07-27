import { ContentTypeHandler } from "../../domain/protocols/ControllerBateries";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import Formidable from 'formidable'
import { rejects } from "assert/strict";
import { forbidden } from "./http-helper";
import { InvalidFileBufferError, MissingFileBufferError } from "../../domain/protocols/Errors";
import { fileRepository } from "../../main/factories";
import { Console } from "console";


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

export interface FormDataFile {
    buffer: Buffer,
    contentType: string,
    size: number
}

export class FormDataParser implements ContentTypeHandler {
    constructor( private readonly fileSchema: Record<string, FileSchema> ){}
    
    execute(request: ExpressRequest, response: ExpressResponse ): Promise<Response | null> {
        if(!this.fileSchema) return null
        const filesBuffer:Record<string, FormDataFile> = {}
        const fieldNames = Object.keys(this.fileSchema)
        const multiples = fieldNames.length > 0  ? true : false
        const formidable = Formidable({ multiples });

        return new Promise((resolve, reject) => {

            formidable.parse(request, async (err: Error, fields:any, files: any) => {
       
                if(err) {return reject(err)} 

                request.body = { ...fields }
                request.files = filesBuffer

                fieldNames.map(fieldName => {
                    const schema = this.fileSchema[fieldName]

                    if( !Object.keys(filesBuffer).includes(fieldName) && schema.optional !== true ){
                        return reject(MissingFileBufferError(fieldName)) 
                    }
                }) 

                return resolve(null)
            }); 
      

            formidable.onPart = (part) => {

                if (!part.filename || !part.mime ) { formidable.handlePart(part); } // all non-files will pass

                if (part.mime && fieldNames.includes(part.name)) { 

                    const { max_size, optional, types } = this.fileSchema[part.name]

                    if(!types.includes(part.mime)) return reject(InvalidFileBufferError(types, max_size, part.name))

                    var bufferList:any =[]
                    var totalSize = 0
                    var form: FormDataFile = {
                        buffer: null,
                        contentType: part.mime,
                        size: 0
                    }
            
                    part.on('data', (buffer) => {
                        bufferList.push(buffer)
                        totalSize += buffer.length
                        if(totalSize > max_size) return reject(InvalidFileBufferError(types, max_size,  part.name))
                    });

                    part.on('end', (data) =>{
                        form.buffer = Buffer.concat(bufferList)
                        form.size = form.buffer.length
                        filesBuffer[part.name] = form
                    })
    
                }
            };
        })
    }
}


