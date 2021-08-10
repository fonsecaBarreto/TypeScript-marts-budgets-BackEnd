import { ContentTypeHandler } from "../../domain/protocols/ControllerBateries";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import Formidable from 'formidable'
import { FilesLengthExceedError, InvalidFileBufferError, MissingFileBufferError } from "../../domain/protocols/Errors";

export interface FileSchema {
    types: string[],
    max_size: number,
    optional: boolean,
    multiples?: number
}

export interface FormDataFile {
    buffer: Buffer,
    contentType: string,
    size: number
    fileName:string
}



export class FormDataParser implements ContentTypeHandler {
    constructor( private readonly fileSchema: Record<string, FileSchema> ){}
    
    execute(request: ExpressRequest, response: ExpressResponse ): Promise<Response | null> {
        if(!this.fileSchema) return null
        const formidable = Formidable({ multiples: true });

        var filesBuffer:Record<string, FormDataFile[] > = {} //result

        const fieldNames = Object.keys(this.fileSchema)

        return new Promise((resolve, reject) => {

            formidable.parse(request, async (err: Error, fields:any) => {
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
      
            var partNameCount: any = {}
            formidable.onPart = (part) => {
          
                if (!part.filename || !part.mime ) { formidable.handlePart(part); } // all non-files will pass

                if (part.mime && fieldNames.includes(part.name)) { // Handle files

                    
                    const { max_size, types, multiples } = this.fileSchema[part.name]
                  
                    partNameCount[part.name]  = partNameCount[part.name] ? partNameCount[part.name] + 1 : 1
                    if(partNameCount[part.name] > multiples ) return reject(FilesLengthExceedError(part.name, multiples))
                  

                    if(!types.includes(part.mime)) return reject(InvalidFileBufferError(types, max_size, part.name, part.filename))

                    var bufferList:any =[]
                    var totalSize = 0

                    var form: FormDataFile = {
                        buffer: null,
                        contentType: part.mime,
                        size: 0,
                        fileName: part.filename
                    }
            
                    part.on('data', (buffer) => {
                        bufferList.push(buffer)
                        totalSize += buffer.length
                        if(totalSize > max_size) return reject(InvalidFileBufferError(types, max_size, part.name, part.filename))
                    });
                    
                    part.on('end', (data) =>{
                        
                        form.buffer = Buffer.concat(bufferList)
                        form.size = form.buffer.length
                        filesBuffer[part.name] = filesBuffer[part.name]?.length ? [ ...filesBuffer[part.name], form ] : [form] 
                    })
    
                }
            };
        })
    }
}


