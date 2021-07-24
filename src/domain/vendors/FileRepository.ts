
export namespace FileRepository{

    export type saveParams = {
        buffer: Buffer, 
        contentType: string, 
        name: string
    }
 
    export type Result = {
        name:string
    }

}

export interface FileRepository {
    
    save(params: FileRepository.saveParams):Promise<FileRepository.Result>

    remove(name:string): Promise<void>

    get(name:string): Promise<any>

}