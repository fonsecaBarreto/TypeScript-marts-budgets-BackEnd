import { success } from "../../helpers/http-helper"
import { Request, Response } from "../../../domain/protocols/http"
import { AccessType, MainController } from "../../helpers/MainController"

import { Knex } from "knex"
import { ProductItem } from "../../../domain/entities/ProductItem"
import { ProductModel } from "../../../domain/entities/ProductModel"
import products from "../../../main/routes/products"
import categories from "../../../main/routes/categories"
import { runInThisContext } from "vm"
import { query } from "express"

export interface ItemClientView {
    name: string, 
    description: string,
    products: any, 
    products_matched_count: number,
    matched_words: string[]
}

export interface ClientSearchResultView{
    total: number,
    subTotal: number,
    items: ItemClientView[],
    related_items: any[]
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

    async searchForItem(offset: number, text_words: string, categories: string[]): Promise<any>{
        const LIMIT = 16
        var subTotal = 0 
        var items: any[] = []

        var query = this.knexConnection('product_items').select("id",'name',"description").offset(offset).limit(LIMIT);
        var count_query = this.knexConnection('product_items')

        if(categories.length > 0 ){
            query.whereIn('category_id', categories) 
            count_query.whereIn('category_id', categories)   
        }

        if(text_words) {
            query.andWhere( (query:any) =>{
                for (const col of text_words) {
                    query.orWhere(`product_items.name`, 'ilike', `%${col}%`) 
                }
            })   

            count_query.andWhere( (query:any) =>{
                for (const col of text_words) {
                    query.orWhere(`product_items.name`, 'ilike', `%${col}%`) 
                }
            })  

        }

        count_query.count('id', {as: 'count'}).first(); 
        
        await Promise.all([
            count_query.then((count:any)=> { subTotal = count ? Number(count.count) : 0 }),  
            query.then( async (it) => { items = it })
        ])

        return { subTotal, items }
    }

    async searchForProduct(text_words: string, brands: string[], categories:string[]): Promise<string[]> {
        if(text_words.length === 0 ) return [] //get to Know all the allowed products
        let pruductsQuery = this.knexConnection('products').select(["id", 'description', 'item_id','brand_id'])
 
        var allowedItemsByCategories = await this.knexConnection('product_items').whereIn('category_id', categories)


        if(text_words){
            pruductsQuery.andWhere( (query:any) =>{
                for (const col of text_words) {
                    query.orWhere(`products.description`, 'ilike', `%${col}%`)
                    query.orWhere(`products.ean`, 'ilike', `%${col}%`) 
                }
            })   
        }

        if(brands.length > 0){
            pruductsQuery.andWhere((query: any) =>{
                query.whereIn('products.brand_id',brands)
            })
        }

        if(categories.length > 0){
            console.log(categories)
            pruductsQuery.andWhere((query: any) =>{
                query.whereIn('products.item_id',allowedItemsByCategories)
            })
        }

        let requiredProducts = await pruductsQuery 

        

        return requiredProducts
    }

    async findproductsInside(item_id: string, brands:string[]) {
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

        /* Queries iniciais */
        const text = request.query.v || '';
        var text_words= text.trim().split(" ")
        text_words = text_words.filter( (c:string)=>( (c !== "") && (c !== "de") && (c !== "para")))

        var categories = (request.query.c) ? Array.isArray(request.query.c) ? request.query.c : [ request.query.c ] : []
        var brands = (request.query.b) ? Array.isArray(request.query.b) ? request.query.b : [ request.query.b ] : []
        const offset = Number(request.query.o) || 0

        console.log("searching for", text_words)

        /* Instanciando o resultado */

        var result: ClientSearchResultView = { 
            total: await this.getTotal(),
            subTotal: 0, 
            items: [] as ItemClientView[],
            related_items: [ ] as any[]
        }

        /* Buscando o item pela pesquisa de categoria e nome */
        const { items, subTotal } = await this.searchForItem(offset, text_words, categories)
               
        result.items = items
        result.subTotal = subTotal
        const itemsFound = result.items.map((j:any,i)=>(j.id))

        /* Produtos encontrados pele pesquisa em texto */
            const productsFound = await this.searchForProduct(text_words, brands, categories) 
            var relatedProduts = [ ...new Set(productsFound.map((p: any)=>(p.id)))] 
            var relatedItems = [ ...new Set(productsFound.map((p: any)=>(p.item_id)))] 
            relatedItems = relatedItems.filter((r,i)=>(!itemsFound.includes(r)))

        /* relatedItems são os items em que existem produtos que correspondem a pesuqisa de texto, com a exeção dos que ja existes */
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

        var text_columns = text.trim().split(" ")
        result.items = await Promise.all(result.items.map( async (j:any,i:number)=>{
            var matched_words:string[] = []
            var products:any[] = []
            var products_matched_count = 0
            products = await this.findproductsInside(j.id, brands)

            var nameSplited = j.name.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "").split(" ")
            nameSplited.map((n: any,i: number)=>{
                if(text_columns.includes(n)){
                    matched_words.push(n)
                }
            })              

            /*  */
            if(relatedProduts?.length > 0 ){
                //contar quantos produtos atendem a pesquisa para reposiciona-los
                products.forEach(p=>{
                    if(relatedProduts.includes(p.id)){
                        products_matched_count+=1
                    }
                })

                products.sort((a, b) => !relatedProduts.includes(a.id) ? 1 : -1) 
            }

            //Destacar o produto aqui tb
            products = await Promise.all(products.map(async (p)=>{
                var distac = false
                var serialized = await this.serializer(p)
                if(relatedProduts.includes(p.id)){
                    distac =true
                }
                return { ...serialized, distac}
                
            }) )

            return ({...j, products_matched_count, matched_words, products,  })
        }))

        //leva ao topo o item onde mais produtos foram encontrados
        result.items.sort((a, b) => (a.products_matched_count < b.products_matched_count ? 1 : -1)) 
        
        return success(result)
        

    }

}