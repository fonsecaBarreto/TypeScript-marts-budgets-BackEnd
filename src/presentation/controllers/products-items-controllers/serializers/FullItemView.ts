import { ProductItem } from "../../../../domain/entities/ProductItem";
import { ProductModel } from "../../../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../../../domain/vendors/DatabaseAdapter";



export interface ItemFullView extends ProductItem{
    category_name: string,
    products: ProductModel[]
}

export const MakeItemFullView = (categoryRepository: DatabaseAdapter, productsRepository: DatabaseAdapter, productSerializer:any ) =>{
    return async (item: ProductItem): Promise<ItemFullView> =>{
        if(!item) return

        var category_name= "";
        var products: ProductModel[] = []
        if(item.category_id){
            let result =  await categoryRepository.find({id: item.category_id})
            if(result){
                category_name = result.name
            }
        }

        products = await productsRepository.list({item_id: item.id})
        if(products.length > 0 )[
            products= await Promise.all(products.map(async p=>{
                return await productSerializer(p)
            }))
        ]
        //lis tproducts here

        return { ...item, category_name, products}
    }
}

export const mapItems = (items: ProductItem[], serializer: any) =>{
    if(!items && items.length === 0) return Promise.resolve([])
    return Promise.all(items.map(async i=>{
        return await serializer(i)
    }))
}