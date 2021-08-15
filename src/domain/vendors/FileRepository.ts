
export namespace FileRepository{

    export type saveParams = {
        buffer: Buffer, 
        contentType: string, 
        name: string
    }
 
    export type Result = {
        name:string
    }

    export type GetResult = {
        stream: any,
        size: number,
        contentType: string
    }

}

export interface FileRepository {
    
    save(params: FileRepository.saveParams):Promise<FileRepository.Result>

    remove(name:string): Promise<void>

    get(name:string): Promise<FileRepository.GetResult>

}