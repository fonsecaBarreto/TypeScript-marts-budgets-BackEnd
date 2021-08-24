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
            "Previsão": "forecast",
            "Produto": "product",
            "Estabelecimento": "mart",
            "REFENCIA_BANCO_DE_DADOS": "id", 
        })
     }

    async dbToExcel(): Promise<any> {
        const orders = await this.repository.list({})

        var serialized = await Promise.all( orders.map( async (o: OrderModel)=>{
                let mart: ""
                let product: ""

                if(o.product_id){
                    let product_result = await this.knexConnection('products').where({id: o.product_id}).first().select("description")
                    product = product_result ? product_result.description : ''
                }

                if(o.mart_id){
                    let mart_result = await this.knexConnection('marts').where({ id: o.mart_id }).first()
                    mart = mart_result ? mart_result.name : ''
                }

                return { ...o, mart, product}
        }) )
       
        const xls = this.xlsParser.write({json: serialized, sheetName: "Ordens"})
        return xls
    }
    async excelToDb(): Promise<any> {

        throw new Error("Method not implemented.");
    }
}