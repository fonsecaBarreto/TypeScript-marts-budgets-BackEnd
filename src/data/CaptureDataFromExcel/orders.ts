import { Knex } from "knex";
import { OrderModel } from "../../domain/entities/OrderModel";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { XlsParserAdapter } from "../../domain/vendors/XlsParserAdapter";
import XlsxAdapter from "../../libs/XlsxAdapter";
import { ExcelParser } from "./ExcelParser";

export class OrdersFromExcel implements ExcelParser{
    readonly xlsParser: XlsParserAdapter;
    constructor(
        readonly repository: DatabaseAdapter,
        readonly knexConnection: Knex,
    ){
        this.xlsParser = new XlsxAdapter({
            "Quantidade": 'quantity',
            "Numero": 'os',
            "Data": "created_at",
            "Previsão": "forecast",
            "Produto": "product",
            "Estabelecimento": "mart",
            "REFENCIA_BANCO_DE_DADOS": "id", 
        })
     }

    async dbToExcel(): Promise<any> {
        const orders = await this.repository.list({})

        var serialized = await Promise.all( orders.map( async (o: OrderModel)=>{
                var mart: string = ""
                var product_str: string =  ""

                if(o.product_id){
                    let product_result = await this.knexConnection('products').where({id: o.product_id}).first().select(["description",'item_id','presentation', 'brand_id'])
                    
                    if(product_result.item_id){
                        let item_result =await this.knexConnection('product_items').where({id:product_result.item_id}).first().select("name")
                        product_str= `${item_result.name}, `
                    }
                    
                    product_str+= product_result.description 

                    if(product_result.presentation){
                        product_str+=` - ${product_result.presentation}`
                    }

                    if(product_result.brand_id){
                        let brand_result =await this.knexConnection('brands').where({id:product_result.brand_id}).first().select("name")
                        product_str+= ` - ${brand_result.name}`
                    }

                 



                }

                if(o.mart_id){
                    let mart_result = await this.knexConnection('marts').where({ id: o.mart_id }).first()
                    mart = mart_result ? mart_result.name : ''
                }

                return { ...o, mart, product: product_str}
        }) )
       
        const xls = this.xlsParser.write({json: serialized, sheetName: "Ordens"})
        return xls
    }
    async excelToDb(): Promise<any> {

        throw new Error("Method not implemented.");
    }
}