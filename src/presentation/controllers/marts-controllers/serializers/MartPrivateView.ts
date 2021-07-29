import { MartModel } from "../../../../domain/entities/MartModel"

export interface MartPrivateView extends Omit<MartModel,'password'> {
    isActive: boolean
}

export const MakeMartPrivateView = (mart: MartModel): MartPrivateView =>{
    if(!mart) return null
    //aqui tave eu deveria resovler o image url e annex url
    const novo=  ({ ...mart, isActive: mart.password ? true : false}) 
    delete novo.password 
    return novo 
}

export const MapMartPrivateView = (marts: any[]):  Promise<any> =>{
    if(marts.length === 0 ) return Promise.resolve([])

    marts.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)

    return Promise.all(marts.map(async (m: MartModel )=> {
        return MakeMartPrivateView(m)
    }))

    
}


