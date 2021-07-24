import { InvalidFileBufferError, MissingFileBufferError } from '../../../domain/protocols/Errors'
import { Response, Request, NextFunction } from 'express'
const multer = require('multer')

export type MulterParams = {
    types: string[],
    limit: number,
    fieldname: string
}
  
export function MakeMulter(params: MulterParams){
    const{ types, limit, fieldname } = params
    return (multer({
      storage: multer.memoryStorage(),
      fileFilter: function (req: Request, file: any, callback:Function) {
        if(!types.includes(file.mimetype)) return (callback({ name: 'FILE_TYPE_INVALID' }, false ))
        callback(null, true)
      },
      limits:{ fileSize: limit }
    })).single(fieldname)
}
  
export function MulterMiddleWare(params: MulterParams): any {
  const { fieldname, limit, types } = params
  const upload = MakeMulter({  types, limit, fieldname })
  return (req: Express.Request, res: Express.Response) => {
    return new Promise((resolve, reject) => { 
      return upload(req, res, (err: any)=>{
        if(err && !req.file)  return reject(InvalidFileBufferError(types, limit))
        if(!req.file) return reject(MissingFileBufferError())
        return resolve(req.file)
      }) 
    })
  }
}
  