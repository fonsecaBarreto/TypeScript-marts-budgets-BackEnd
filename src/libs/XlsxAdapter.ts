import { XlsParserAdapter } from '../domain/vendors/XlsParserAdapter'
import xlsx from 'xlsx'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream';


function bufferToStream(buffer: Buffer) { 
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

export default class XlsxAdapter implements XlsParserAdapter{

    constructor(private readonly schema: XlsParserAdapter.SerialSchema){ }

    read(params: XlsParserAdapter.ReadParams): XlsParserAdapter.ReadResult {
        var { file, sheetName } = params

        var schema = this.schema
        
        const workbook = xlsx.read(file);
        if(!workbook.SheetNames.includes(sheetName)) throw new Error("SheetDoenstExits")
        
        const sheet = workbook.Sheets[sheetName];

        const json = xlsx.utils.sheet_to_json(sheet)

        var malformedList: any = []
        var list:any = []

        json.map( (col:any) =>{


            var serializedColumn: Record<string, string> = { }

            var invalidColumn = {
                missing: [] as any,
                col: serializedColumn,
            }

            Object.keys(schema).map((label)=>{ // Verifica se contem todas as chaves do squema
                const key = schema[label] 
                
                if ( !Object.keys(col).includes(label)){ 
                    return invalidColumn.missing.push(key)
                }

                serializedColumn[key] = col[label]
            })

            if(invalidColumn.missing.length > 0) return malformedList.push(invalidColumn)

            
            return list.push(serializedColumn)
        })

        return { list, malformedList }
    }

    write(params:XlsParserAdapter.WriteParams): any {

        const { json, sheetName } =params

        var data:any= []

        json.map( (col:any) =>{

            var serializedColumn: Record<string, string> = { }

            Object.keys(this.schema).map((label)=>{ // Verifica se contem todas as chaves do squema
                const key = this.schema[label] 
            
                serializedColumn[label] = col[key]
            })

            data.push(serializedColumn)

        })

        var newWb = xlsx.utils.book_new()
        var newWs = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(newWb, newWs, sheetName)

        const buffer= xlsx.write(newWb, { bookType: "xlsx", type: "buffer" }) 
        const stream = bufferToStream(buffer)                   // convert buffer to stream
        return stream
    
    }
}
