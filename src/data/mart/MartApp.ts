import { MartNotFoundError } from "../../domain/protocols/Errors"
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter"

export class MartApp {
    constructor(
        private readonly martRepository: DatabaseAdapter
    ){  }

    async exists( id:string) {
        const mart = await this.martRepository.find({id})
        if(!mart) throw MartNotFoundError()
    }

    async remove(id:string){
        await this.exists(id)
        await this.martRepository.remove({id})
        return 
    }

    async find(id:string){
        if(id){
            const mart = await this.martRepository.find({id})
            return mart
        }
        return await this.martRepository.list({})
    }

}
