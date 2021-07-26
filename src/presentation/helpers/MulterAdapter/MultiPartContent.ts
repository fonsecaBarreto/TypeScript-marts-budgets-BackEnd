import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { ContentTypeHandler } from "../../../domain/protocols/ControllerBateries"
import { Response } from '../../../domain/protocols/http'
import { MulterMiddleWare } from './MulterFactory'
import { contentType } from 'mime-types'
import { MartNotFoundError } from '../../../domain/protocols/Errors'

const COMMON_IMAGES =  ["image/png", "image/jpeg", "image/jpg", "image/webp" ]

const COMMON_DOCUMENTS  = [ 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf"
]


const getImage = MulterMiddleWare({ types: COMMON_IMAGES, limit:  10e+6, fieldname: "image" })
const getDocuments = MulterMiddleWare({ types: [ ...COMMON_DOCUMENTS ], limit:  10e+6, fieldname: "document"})

export enum ContentType { IMAGE, DOCUMENT }

export class MultiPartContent implements ContentTypeHandler {
    constructor( private readonly contentType: ContentType ){}
    
    async execute(request: ExpressRequest, response: ExpressResponse ): Promise<Response | null> {
        
        var file: any

        switch(this.contentType){
            case ContentType.DOCUMENT : file = await getDocuments(request, response)
            default: file = await getImage(request, response)
        }

        request.file = file

        return null 


    
    }
}


