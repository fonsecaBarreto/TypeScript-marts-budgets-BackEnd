import { Addresses } from "../../../../domain/entities/Addresses"
import { MartModel } from "../../../../domain/entities/MartModel"
import { ProviderModel } from "../../../../domain/entities/ProductModel"
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter"

export interface ProviderPrivateView extends ProviderModel {
    address: Addresses
}

export const MakeProviderPrivateView = ( addressRepository: DatabaseAdapter ) =>{
    return async (provider: ProviderModel): Promise<ProviderPrivateView> => {
        if(!provider) return 
        const address = !provider.address_id ? null : await addressRepository.find({ id: provider.address_id })
        const novo=  ({ ...provider, address }) 
        return novo
}}

export const mapProviders = (providers: any[], serializer: any):  Promise<any> =>{
    if(providers.length === 0 ) return Promise.resolve([])
    return Promise.all(providers.map(async (m: MartModel )=> {
        return serializer(m)
    })) 
}


