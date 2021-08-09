import { Addresses } from "../../../../domain/entities/Addresses"
import { MartModel } from "../../../../domain/entities/MartModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

export interface MartPrivateView extends Omit<MartModel,'password'> {
    isActive: boolean,
    address: Addresses
}


export const MakeMartPrivateView = ( addressRepository: DatabaseAdapter ) =>{
    return async (mart: MartModel): Promise<MartPrivateView> => {
    if(!mart) return 
    const address = !mart.address_id ? null : await addressRepository.find({ id: mart.address_id })
    const novo=  ({ ...mart, address, isActive: mart.password ? true : false}) 
    delete novo.password 
    return novo
}}

export const MapMarts = (marts: any[], serializer: any):  Promise<any> =>{
    if(marts.length === 0 ) return Promise.resolve([])
    return Promise.all(marts.map(async (m: MartModel )=> {
        return serializer(m)
    })) 
}


