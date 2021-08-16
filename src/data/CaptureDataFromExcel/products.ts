import { Knex } from "knex";
import { ProductModel } from "../../domain/entities/ProductModel";
import { DatabaseAdapter } from "../../domain/vendors/DatabaseAdapter";
import { XlsParserAdapter } from "../../domain/vendors/XlsParserAdapter";
import XlsxAdapter from "../../libs/XlsxAdapter";
import { ExcelParser } from "./ExcelParser";



export class ProductsFromExcel implements ExcelParser{
    readonly xlsParser: XlsParserAdapter;
    constructor(
        readonly repository: DatabaseAdapter,
        readonly knexConnection: Knex,
    ){
        this.xlsParser = new XlsxAdapter({
            "Item": 'item',
            "Marca": 'brand',
            "Especificação": "description",
            "Apresentação": "presentation",
            "NCM": "ncm",
            "EAN": "ean",
            "SKU": "sku",
            "REFENCIA_BANCO_DE_DADOS": "id", 
        })
     }

    async dbToExcel(): Promise<any> {
        const products = await this.repository.list({})

        var serialized = await Promise.all( products.map( async (p: ProductModel)=>{
                let brand: ""
                let item: ""
                if(p.brand_id){
                    let brand_result = await this.knexConnection('brands').where({id: p.brand_id}).first()
                    brand = brand_result ? brand_result.name : ''
                }

                if(p.item_id){
                    let item_result = await this.knexConnection('product_items').where({id: p.item_id}).first()
                    item = item_result ? item_result.name : ''
                }

                return { ...p, brand, item}

            }) )
       
        const xls = this.xlsParser.write({json: serialized, sheetName: "products"})



        return xls
    }
    async excelToDb(): Promise<any> {

        throw new Error("Method not implemented.");
    }
}