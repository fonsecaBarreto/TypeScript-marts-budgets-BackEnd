import { DatabaseAdapter } from "../../../domain/vendors/DatabaseAdapter";
import { FileRepository } from "../../../domain/vendors/FileRepository";
import { IdGenerator } from "../../../domain/vendors/Utils";

export namespace CreateAnnex {
    export type Params = {
        buffer: Buffer,
        contentType: string,
        mart_id:string,
        name: string
    }
}

export default class CreateAnnex {
    constructor(
        private readonly idGenerator: IdGenerator,
        private readonly fileRepository: FileRepository,
        private readonly annexsRepository: DatabaseAdapter
    ){ }
    async execute(params: CreateAnnex.Params): Promise<boolean>{

        const { buffer, contentType, mart_id, name } = params

        const id = await this.idGenerator.generate()

        const fileStored = await this.fileRepository.save({
            buffer, contentType,
            name: `documents/${Date.now()}_${name}`
        })

        await this.annexsRepository.insert({
            id,  mart_id, contentType, name: fileStored.name,
        })

        return true
    }
}