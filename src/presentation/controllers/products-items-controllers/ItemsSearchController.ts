import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"

import { Knex } from "knex"
import { ProductItem } from "../../../domain/entities/ProductItem"
import { ProductModel } from "../../../domain/entities/ProductModel"
import products from "../../../main/routes/products"
import categories from "../../../main/routes/categories"
import { runInThisContext } from "vm"

export interface ItemClientView {
    name: string, 
    description: string,
    products: any //ProductModel[]
}

export interface ClientSearchResultView{
    total: number,
    subTotal: number,
    items: ItemClientView[],
    related_items: any[] //items em que produtos corresponderam a pergunta
}

export class ItemsSearchController extends MainController{
    constructor( 
         private readonly knexConnection: Knex,
         private readonly serializer: any
    ){  super(AccessType.MART_OR_ADMIN) }

    async getTotal(){
        const totalOfITems = await this.knexConnection('product_items').count('id', { as: 'count' }).first();
        return totalOfITems ? Number(totalOfITems.count) : 0
    }

    async searchForItem(offset: number, item_name: string, categories: string[]): Promise<any>{
        const LIMIT = 20
        var subTotal = 0 
        var items: any[] = []

        var query = this.knexConnection('product_items').select("id",'name',"description").offset(offset).limit(LIMIT);
        var count_query = this.knexConnection('product_items')

        if(categories.length > 0 ){
            query.whereIn('category_id', categories) 
            count_query.whereIn('category_id', categories)   
        }

        if(item_name) {

            var columns = item_name.split(" ")
            console.log(columns)
            query.andWhere( (query:any) =>{
                for (const col of columns) {
                    query.orWhere(`product_items.name`, 'ilike', `%${col}%`) 
                }
            })   
            count_query.andWhere( (query:any) =>{  query.where(`product_items.name`, 'ilike', `%${item_name}%`) })  
        }

        count_query.count('id', {as: 'count'}).first(); 
        
        await Promise.all([
            count_query.then((count:any)=> { subTotal = count ? Number(count.count) : 0 }),  
            query.then( async (it) => { items = it })
        ])

        return { subTotal, items }
    }

    async searchForProduct(text: string, brands: string[] ): Promise<string[]>{
   
        if(!text ) return [] //get to Know all the allowed products
        let pruductsQuery = this.knexConnection('products').select(["id", 'description', 'item_id','brand_id'])
 
        if(text){

            var columns = text.split(" ")

            pruductsQuery.andWhere( (query:any) =>{

                for (const col of columns) {

                    query.orWhere(`products.description`, 'ilike', `%${col}%`)
                    query.orWhere(`products.ean`, 'ilike', `%${col}%`) 
                }
            })   
        }

        if(brands.length > 0){
            pruductsQuery.whereIn('products.brand_id',brands)
        }
        
        let requiredProducts = await pruductsQuery 

        return requiredProducts
        
    }

    async findproductsInside(item_id: string, brands:string[]){
        if(!item_id) return []
        if(brands?.length > 0){
            const result = await this.knexConnection('products').whereIn('brand_id',brands).andWhere({"item_id": item_id}).select("*")
            return result
        }else{
            const result = await this.knexConnection('products').where({"item_id": item_id}).select("*")
            return result
        }
    }

    async handler(request: Request): Promise<Response> {

        const text = request.query.v || '';
        var categories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [ request.query.c ] : []
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : []
        const offset = Number(request.query.o) || 0


        var result: ClientSearchResultView = { 
            total: await this.getTotal(),
            subTotal: 0, 
            items: [] as ItemClientView[],
            related_items: [ ] as any[]
        }

        /* Buscando o item pela pesquisa de categoria e nome */
        const { items, subTotal } = await this.searchForItem(offset, text, categories)
               
        result.items = items
        result.subTotal = subTotal
        const itemsFound = result.items.map((j:any,i)=>(j.id))

        /* Produtos encontrados pele pesquisa em texto */

        const productsFound = await this.searchForProduct(text, brands) 
        var relatedProduts = [ ...new Set(productsFound.map((p: any)=>(p.id)))] 
        var relatedItems = [ ...new Set(productsFound.map((p: any)=>(p.item_id)))] 
        relatedItems = relatedItems.filter((r,i)=>(!itemsFound.includes(r)))
        //relatedItems são os items em que existem produtos que correspondem a pesuqisa de texto, com a exeção dos que ja existes
        //Items found receberar todos os item
        //enqunato relatedItems receberar somento os productos encontrados
        result.related_items = await Promise.all(relatedItems.map( async (item_id:any,i: number)=>{
            var products:any[] = []
            var item = await this.knexConnection('product_items').where({ id: item_id }).select("id",'name',"description").first()
            products = productsFound.filter((p:any)=>(p.item_id === item_id))
            products = await Promise.all(products.map(async (p)=>{

                var serialized = await this.serializer(p)
                return { ...serialized, distac: true }
                
            }) )
            return ({...item,products})
        }))


        result.items = await Promise.all(result.items.map( async (j:any,i:number)=>{
            var products:any[] = []
            products = await this.findproductsInside(j.id, brands)

            if(relatedProduts?.length > 0 ){
                products.sort((a, b) => !relatedProduts.includes(a.id) ? 1 : -1) 
            }
            //estacar o produto aqui tb

            products = await Promise.all(products.map(async (p)=>{
                var distac = false
                var serialized = await this.serializer(p)
                if(relatedProduts.includes(p.id)){
                    distac =true
                }
                return { ...serialized, distac}
                
            }) )

            return ({...j, products})
        }))
        
        return success(result)
        

    }





    
}