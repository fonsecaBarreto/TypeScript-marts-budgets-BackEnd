import XlsxADapter from '../../../src/libs/XlsxAdapter'
import path from 'path'
import fs from 'fs'
const file = fs.readFileSync(path.join(__dirname,"teste.xlsx"))
const file2 = fs.readFileSync(path.join(__dirname,"teste2.xlsx"))

const makeSut = () =>{

    let schema = { 
        "Item":"item", 
        "Marca":"brand",
        "Especificação":"description",
        "Apresentação": "presentation"
    } 

    return new XlsxADapter(schema)
}

describe('Xlsx Adapter', () =>{

    test('should give error if sheet doenst exists', async () =>{
        const sut = makeSut()
        expect(() => {
            sut.read({   file,  sheetName: 'não existe'  })
        }).toThrow('SheetDoenstExits');
    })

    test('should read from excel sheet', async () =>{

        const sut = makeSut()
        const result = await sut.read({
            file: file2,
            sheetName: 'items'
        })
/* 
        console.log(result) */
        expect(result).toBeTruthy()

    })

    test('should write excel from json', async () =>{

        const sut = makeSut()
        const result = await sut.write({
            json: [
                {
                    item:"Ser Humano",
                    brand: "Minha marca",
                    description:"Lucas Fonseca",
                    presentation: "110kg"
                },
                {
                    item:"Um Outro ser",
                    brand: "Minha aasdsad ca",
                    description:"Lucas Fonsec ASa",
                    presentation: "110kg"
                }
            ]
            , sheetName: 'Foha teste'
        })
      /*   console.log(result)
        const writeStream = fs.createWriteStream( path.join(__dirname,"test123.xlsx"), result)
        writeStream.write('aef35ghhjdk74hja83ksnfjk888sfsf', 'base64'); */

        expect(result).toBeTruthy()
        expect(result).toHaveProperty('stream')
        expect(result).toHaveProperty('size')
    })
})