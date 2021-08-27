import { Addresses } from "../../../../domain/entities/Addresses"
import { MartAnnex, MartModel, MartsCheckList } from "../../../../domain/entities/MartModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

export interface MartPrivateView extends Omit<MartModel,'password'> {
    isActive: boolean,
    address: Addresses,
    annexes: MartAnnex[],
    checkList: MartsCheckList
}

export const MakeMartPrivateView = ( addressRepository: DatabaseAdapter, annexsRepository: DatabaseAdapter, checklistsRepository: DatabaseAdapter ) =>{
    return async (mart: MartModel): Promise<MartPrivateView> => {
        if(!mart) return 

        var checkList = null
        const checkListExists = await checklistsRepository.find({mart_id: mart.id})
        if(checkListExists){ checkList = checkListExists }
        // Should i have a universal database seearker i think it is better this way
        const address = !mart.address_id ? null : await addressRepository.find({ id: mart.address_id })
        const annexes = await annexsRepository.list({mart_id: mart.id})
        const novo=  ({ ...mart, address, annexes, checkList, isActive: mart.password ? true : false}) 
        delete novo.password 
        return novo
}}

export const MapMarts = (marts: any[], serializer: any):  Promise<any> =>{
    if(marts.length === 0 ) return Promise.resolve([])
    return Promise.all(marts.map(async (m: MartModel )=> {
        return serializer(m)
    })) 
}


