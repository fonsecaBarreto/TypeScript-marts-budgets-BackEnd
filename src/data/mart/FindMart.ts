
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";

export default class FindMart {
    constructor(
        private readonly martsRepository: DatabaseAdapter,
    ){}

    async execute(id:string) {
        if(id){
            const mart = await this.martsRepository.find({id})
            return mart
        }
        return await this.martsRepository.list({})
    }
}


