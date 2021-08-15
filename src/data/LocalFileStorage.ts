import { FileRepository } from '../domain/vendors/FileRepository'
import path from 'path'
import fs from 'fs'
import mime from 'mime-types'

export default class LocalStorage implements FileRepository{
  constructor(
    private readonly root_directory: string,
  ){ }

    async save(params: FileRepository.saveParams): Promise<FileRepository.Result> {
        const { buffer, contentType, name } = params
        var dir = path.resolve(`${this.root_directory}`, path.dirname(name))
        if (!fs.existsSync(dir)){ fs.mkdirSync(dir, { recursive: true }); }

        const ext = mime.extension(contentType) 
        const result = `${name}.${ext}`
        fs.writeFileSync(`${this.root_directory}/${result}`, buffer)

        return ({ name: result })
    }

    async get(name: string): Promise<FileRepository.GetResult> {

        const fullpath = path.join(this.root_directory, name)

        const file = fs.readFileSync(fullpath)

        const ext = path.extname(name)
        const stream = fs.createReadStream(fullpath)
 
        return { stream, size: file.length, contentType: mime.contentType(ext) || '' }
    }


    async remove( name:string ): Promise<void> {

        const fullpath = path.join(`${this.root_directory}`,name)
        const exists = fs.existsSync(fullpath)
        if(!exists) return 

        return fs.rmSync(fullpath,{recursive: true, force:true  })
    }

}


